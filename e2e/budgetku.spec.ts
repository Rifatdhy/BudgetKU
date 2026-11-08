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
    await page.getByRole('button', { name: 'Perbarui ringkasan' }).click();
    await expect(page.getByRole('button', { name: 'Menghitung...' })).toBeVisible();
    await expect(summary.getByText('Rp 700.000')).toBeVisible();
    await expect(summary.getByText('Rp 4.300.000')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Aman' })).toBeVisible();
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

    const alert = page.getByRole('alert');
    await expect(alert.getByText('Melebihi anggaran', { exact: true })).toBeVisible();
    await expect(
      alert.getByText('Total pengeluaran tidak boleh melebihi pendapatan bulanan.'),
    ).toBeVisible();

    const summary = page.getByRole('region', { name: 'Ringkasan anggaran' });
    await expect(summary.getByText('Rp 100.000')).toBeHidden();

    await page.getByRole('button', { name: 'Perbarui ringkasan' }).click();
    await expect(page.getByRole('button', { name: 'Menghitung...' })).toBeHidden();
    await expect(summary.getByText('Belum diatur')).toBeVisible();
  });

  test('updates the summary only after confirming the budget', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Pendapatan bulanan').fill('1000000');
    await page.getByRole('button', { name: 'Tambah kategori pertama' }).click();
    await page.getByLabel('Nama kategori').fill('Rumah');
    await page.getByLabel('Nama pengeluaran').fill('Belanja');
    await page.getByLabel('Nominal').fill('200000');

    const summary = page.getByRole('region', { name: 'Ringkasan anggaran' });
    await page.getByRole('button', { name: 'Perbarui ringkasan' }).click();
    await expect(summary.getByText('Rp 800.000')).toBeVisible();

    await page.getByLabel('Pendapatan bulanan').fill('2000000');
    await page.getByLabel('Nominal').fill('500000');
    await expect(summary.getByText('Rp 800.000')).toBeVisible();
    await expect(summary.getByText('Rp 1.500.000')).toBeHidden();

    await page.getByRole('button', { name: 'Perbarui ringkasan' }).click();
    await expect(summary.getByText('Rp 1.500.000')).toBeVisible();
  });

  test('shows duplicate category validation and blocks invalid submit loading', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Pendapatan bulanan').fill('1000000');
    await page.getByRole('button', { name: 'Tambah kategori pertama' }).click();
    await page.getByLabel('Nama kategori').fill('Rumah');
    await page.getByRole('button', { name: 'Tambah kategori' }).click();
    await page.getByLabel('Nama kategori').nth(1).fill(' rumah ');

    await expect(page.getByText('Nama kategori tidak boleh duplikat.')).toBeVisible();
    await page.getByRole('button', { name: 'Perbarui ringkasan' }).click();
    await expect(page.getByRole('button', { name: 'Menghitung...' })).toBeHidden();
  });

  test('rejects duplicate expense names within one category', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Tambah kategori pertama' }).click();
    await page.getByLabel('Nama kategori').fill('Rumah');
    await page.getByLabel('Nama pengeluaran').first().fill('Listrik');
    await page.getByLabel('Nominal').first().fill('100000');
    await page.getByRole('button', { name: 'Tambah item pengeluaran' }).click();
    await page.getByLabel('Nama pengeluaran').nth(1).fill(' listrik ');

    await expect(
      page.getByText('Item "listrik" tidak boleh duplikat dalam kategori yang sama.'),
    ).toBeVisible();
  });

  test('removes a category at a middle index without breaking the rest', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Tambah kategori pertama' }).click();
    await page.getByLabel('Nama kategori').first().fill('Rumah');
    await page.getByRole('button', { name: 'Tambah kategori' }).click();
    await page.getByLabel('Nama kategori').nth(1).fill('Transportasi');
    await page.getByRole('button', { name: 'Tambah kategori' }).click();
    await page.getByLabel('Nama kategori').nth(2).fill('Makanan');

    await page.getByRole('button', { name: 'Hapus kategori 2' }).click();

    await expect(page.getByLabel('Nama kategori')).toHaveCount(2);
    await expect(page.getByLabel('Nama kategori').nth(0)).toHaveValue('Rumah');
    await expect(page.getByLabel('Nama kategori').nth(1)).toHaveValue('Makanan');
  });

  test('resets the budget and keeps the mobile form within the viewport after adding rows', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Pendapatan bulanan').fill('1000000');
    await page.getByRole('button', { name: 'Tambah kategori pertama' }).click();
    await page.getByLabel('Nama kategori').fill('Rumah');
    await page.getByRole('button', { name: 'Tambah item pengeluaran' }).click();
    await page.getByRole('button', { name: 'Reset anggaran' }).click();

    await expect(page.getByText('Belum ada kategori')).toBeVisible();
    await expect(page.getByLabel('Pendapatan bulanan')).toHaveValue('0');
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
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

  test('replaces the initial zero when typing income after focusing the field', async ({ page }) => {
    await page.goto('/');
    const income = page.getByLabel('Pendapatan bulanan');

    await income.click();
    await income.pressSequentially('5000000');

    await expect(income).toHaveValue('5.000.000');
  });

  test('replaces the initial zero when typing an expense amount after focusing the field', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Tambah kategori pertama' }).click();

    const amount = page.getByLabel('Nominal').first();
    await amount.click();
    await amount.pressSequentially('250000');

    await expect(amount).toHaveValue('250.000');
  });

  test('formats income and expense amounts with Indonesian thousands separators', async ({ page }) => {
    await page.goto('/');

    const income = page.getByLabel('Pendapatan bulanan');
    await income.fill('3000000');
    await expect(income).toHaveValue('3.000.000');

    await page.getByRole('button', { name: 'Tambah kategori pertama' }).click();
    const amount = page.getByLabel('Nominal').first();
    await amount.fill('1250000');
    await expect(amount).toHaveValue('1.250.000');
  });

  test('updates budget progress and toggles category details', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Pendapatan bulanan').fill('1000000');
    await page.getByRole('button', { name: 'Tambah kategori pertama' }).click();
    await page.getByLabel('Nama kategori').fill('Transportasi');
    await page.getByLabel('Nama pengeluaran').fill('Bensin');
    await page.getByLabel('Nominal').fill('250000');
    await page.getByRole('button', { name: 'Perbarui ringkasan' }).click();

    await expect(page.getByText('25% dari pendapatan terpakai')).toBeVisible();
    await expect
      .poll(() =>
        page.locator('.progress-value').evaluate((element) => {
          const track = element.parentElement;
          return track ? (element.getBoundingClientRect().width / track.getBoundingClientRect().width) * 100 : 0;
        }),
      )
      .toBeGreaterThan(0);

    const progressWidth = await page.locator('.progress-value').evaluate((element) => {
      const track = element.parentElement;
      return track ? (element.getBoundingClientRect().width / track.getBoundingClientRect().width) * 100 : 0;
    });
    expect(progressWidth).toBeLessThan(100);

    const closeButton = page.getByRole('button', { name: 'Tutup Transportasi' });
    await closeButton.click();
    await expect(page.getByText('Rincian disembunyikan. Tekan Lihat detail untuk melihat item.')).toBeVisible();
    await expect(page.getByLabel('Nama pengeluaran')).toBeHidden();

    await page.getByRole('button', { name: 'Lihat detail Transportasi' }).click();
    await expect(page.getByLabel('Nama pengeluaran')).toBeVisible();
  });
});
