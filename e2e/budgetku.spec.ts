import { expect, test } from '@playwright/test';

test.describe('BudgetKu', () => {
  test('supports the main budget workflow and validation', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'BudgetKu' })).toBeVisible();
    await expect(page.getByText('Belum ada kategori')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Belum diatur' })).toBeVisible();

    await page.getByLabel('Pendapatan bulanan').fill('5000000');
    await page.getByRole('button', { name: 'Tambah kategori pertama' }).click();
    await expect(page.getByText('Belum ada kategori')).toBeHidden();

    await page.getByLabel('Nama kategori').fill('Kebutuhan Rumah');
    await page.getByLabel('Nama pengeluaran').first().fill('Listrik');
    await page.getByLabel('Nominal').first().fill('500000');
    await page.getByRole('button', { name: 'Tambah item pengeluaran' }).click();
    await page.getByLabel('Nama pengeluaran').nth(1).fill('Air');
    await page.getByLabel('Nominal').nth(1).fill('200000');

    const summary = page.getByRole('region', { name: 'Ringkasan anggaran' });
    await expect(summary.getByText('Rp 700.000')).toBeVisible();
    await expect(summary.getByText('Rp 4.300.000')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Aman' })).toBeVisible();

    await page.getByRole('button', { name: 'Perbarui ringkasan' }).click();
    await expect(page.getByRole('button', { name: 'Menghitung...' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Perbarui ringkasan' })).toBeVisible();

    await page.getByRole('button', { name: 'Tambah kategori' }).click();
    await page.getByLabel('Nama kategori').nth(1).fill('kebutuhan rumah');
    await expect(page.getByText('Kategori "kebutuhan rumah" tidak boleh duplikat.')).toBeVisible();

    await page.getByRole('button', { name: 'Hapus kategori 2' }).click();
    await expect(page.getByText('Kategori "kebutuhan rumah" tidak boleh duplikat.')).toBeHidden();

    await page.getByRole('button', { name: 'Reset anggaran' }).click();
    await expect(page.getByText('Belum ada kategori')).toBeVisible();
    await expect(page.getByLabel('Pendapatan bulanan')).toHaveValue('0');
  });

  test('shows the over-budget state', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Pendapatan bulanan').fill('100000');
    await page.getByRole('button', { name: 'Tambah kategori pertama' }).click();
    await page.getByLabel('Nama kategori').fill('Kebutuhan Rumah');
    await page.getByLabel('Nama pengeluaran').first().fill('Belanja');
    await page.getByLabel('Nominal').first().fill('150000');

    await expect(page.getByRole('heading', { name: 'Melebihi anggaran' })).toBeVisible();
    await expect(page.getByText('Total pengeluaran tidak boleh melebihi pendapatan bulanan.')).toBeVisible();
  });

  test('keeps the mobile layout within the viewport', async ({ page }) => {
    await page.goto('/');

    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));

    expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
    await expect(page.getByRole('button', { name: 'Tambah kategori pertama' })).toBeVisible();
  });

  test('allows typing into the category name field', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Tambah kategori pertama' }).click();

    const categoryInput = page.getByLabel('Nama kategori');
    await categoryInput.click();
    await categoryInput.pressSequentially('Kebutuhan Rumah');

    await expect(categoryInput).toHaveValue('Kebutuhan Rumah');
  });

  test('updates budget progress and toggles category details', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Pendapatan bulanan').fill('1000000');
    await page.getByRole('button', { name: 'Tambah kategori pertama' }).click();
    await page.getByLabel('Nama kategori').fill('Transportasi');
    await page.getByLabel('Nama pengeluaran').fill('Bensin');
    await page.getByLabel('Nominal').fill('250000');

    await expect(page.getByText('25% dari pendapatan terpakai')).toBeVisible();
    const progressWidth = await page.locator('.progress-value').evaluate((element) => {
      const track = element.parentElement;
      return track ? (element.getBoundingClientRect().width / track.getBoundingClientRect().width) * 100 : 0;
    });
    expect(progressWidth).toBeGreaterThan(0);
    expect(progressWidth).toBeLessThan(100);

    const closeButton = page.getByRole('button', { name: 'Tutup Transportasi' });
    await closeButton.click();
    await expect(page.getByText('Rincian disembunyikan. Tekan Buka untuk melihat item.')).toBeVisible();
    await expect(page.getByLabel('Nama pengeluaran')).toBeHidden();

    await page.getByRole('button', { name: 'Buka Transportasi' }).click();
    await expect(page.getByLabel('Nama pengeluaran')).toBeVisible();
  });
});
