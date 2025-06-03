# 💰 BudgetPro - Smart Finance Manager

<div align="center">

![BudgetPro Logo](https://img.shields.io/badge/💰-BudgetPro-blue?style=for-the-badge&logoColor=white)

**Aplikasi manajemen keuangan modern dengan analisis prediktif dan UI yang elegan**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

[Demo Live](https://erzambayu.github.io/budget-manager) · [Laporkan Bug](https://github.com/Erzambayu/budget-manager/issues) · [Request Fitur](https://github.com/Erzambayu/budget-manager/issues)

</div>

## 📋 Daftar Isi

- [Tentang Aplikasi](#-tentang-aplikasi)
- [Fitur Utama](#-fitur-utama)
- [Demo & Screenshot](#-demo--screenshot)
- [Teknologi](#-teknologi)
- [Instalasi](#-instalasi)
- [Penggunaan](#-penggunaan)
- [Struktur Project](#-struktur-project)
- [Kontribusi](#-kontribusi)
- [Roadmap](#-roadmap)
- [Lisensi](#-lisensi)
- [Kontak](#-kontak)

## 🎯 Tentang Aplikasi

**BudgetPro** adalah aplikasi manajemen keuangan pribadi yang modern dan powerful, dirancang untuk membantu Anda mengelola keuangan dengan lebih smart dan efisien. Dengan antarmuka yang intuitif dan fitur analisis mendalam, BudgetPro memberikan insights yang valuable untuk mengoptimalkan pengelolaan keuangan Anda.

### 🌟 Mengapa BudgetPro?

- **🎨 UI/UX Modern**: Desain yang clean, responsive, dan user-friendly
- **📊 Analisis Mendalam**: Prediksi keuangan berbasis AI dan pattern analysis  
- **🌙 Dark/Light Theme**: Pilihan tema sesuai preferensi Anda
- **📱 Mobile-First**: Optimized untuk semua device dengan gesture support
- **💾 Local Storage**: Data tersimpan aman di browser Anda
- **🚀 No Backend Required**: Pure frontend application, mudah di-deploy

## ✨ Fitur Utama

### 💳 Manajemen Transaksi
- ➕ Tambah pemasukan dan pengeluaran dengan mudah
- 📝 Kategorisasi otomatis dengan icon dan warna
- 📅 Filter berdasarkan tanggal dan kategori
- ✏️ Edit dan hapus transaksi
- 🔍 Pencarian transaksi

### 🏦 Manajemen Akun
- 💰 Kelola multiple akun (Bank, E-Wallet, Cash, Investasi)
- 📊 Real-time balance tracking
- 🎯 Visual indicators untuk setiap jenis akun
- 📈 History transaksi per akun

### 🎯 Target Keuangan (Goals)
- 🎪 Set target tabungan dengan deadline
- 📊 Progress tracking dengan visual indicators
- 💡 Smart recommendations untuk mencapai target
- 🏆 Achievement system

### 📈 Analytics & Insights
- **🏥 Health Score**: Penilaian kesehatan keuangan
- **📊 Weekly Trends**: Analisis tren mingguan pemasukan/pengeluaran
- **🥧 Category Distribution**: Visualisasi distribusi pengeluaran per kategori
- **🔮 Predictive Analysis**: Prediksi keuangan bulan depan berdasarkan historical data
- **🔍 Expense Patterns**: Analisis pola pengeluaran harian dan bulanan
- **🎯 Budget Analysis**: Tracking budget per kategori dengan alert system

### 🎛️ Fitur Tambahan
- 🌙 **Dark/Light Theme**: Toggle tema sesuai preferensi
- 📱 **Responsive Design**: Optimal di desktop, tablet, dan mobile
- 👆 **Swipe Gestures**: Navigasi mobile yang intuitif
- ⌨️ **Keyboard Shortcuts**: Akses cepat dengan shortcut (Ctrl+1-5, Ctrl+N)
- 🎲 **Demo Data**: Load sample data untuk testing fitur
- 🔄 **Data Reset**: Reset semua data dengan konfirmasi
- 💾 **Auto Save**: Data tersimpan otomatis ke localStorage

## 🖼️ Demo & Screenshot

### Dashboard Utama
```
┌─────────────────────────────────────────────────┐
│ 💰 Total Saldo    📈 Pemasukan    💸 Pengeluaran │
│ Rp 5.750.000     Rp 8.000.000    Rp 2.250.000   │
└─────────────────────────────────────────────────┘

📊 Trend Mingguan          🥧 Distribusi Kategori
```

### Analytics Dashboard
```
🏥 Kesehatan Keuangan: 85/100
📈 Prediksi Bulan Depan:
   💰 Pemasukan: Rp 8.200.000 (+2.5%)
   💸 Pengeluaran: Rp 2.100.000 (-6.7%)
```

## 🛠️ Teknologi

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Storage**: LocalStorage API
- **Icons**: Unicode Emoji
- **Responsive**: CSS Grid & Flexbox
- **Animations**: CSS Transitions & Transform
- **Charts**: Custom CSS-based visualizations

## 🚀 Instalasi

### Option 1: Clone Repository
```bash
git clone https://github.com/Erzambayu/budget-manager.git
cd budget-manager
```

### Option 2: Download ZIP
1. Download ZIP file dari [releases page](https://github.com/Erzambayu/budget-manager/releases)
2. Extract ke folder pilihan Anda
3. Buka `index.html` di browser

### Option 3: GitHub Pages
Akses langsung di: [https://erzambayu.github.io/budget-manager](https://erzambayu.github.io/budget-manager)

## 📖 Penggunaan

### 1. **Setup Awal**
```javascript
// Buka aplikasi di browser
// Data akan tersimpan otomatis di localStorage
```

### 2. **Tambah Akun Pertama**
- Klik tombol "🏦 Tambah Akun"
- Pilih jenis akun (Bank/E-Wallet/Cash/Investasi)
- Input nama dan saldo awal

### 3. **Catat Transaksi**
- Gunakan tombol "💰 Tambah Pemasukan" atau "💸 Tambah Pengeluaran"
- Pilih kategori dan akun
- Tambahkan deskripsi (opsional)

### 4. **Set Target**
- Buka halaman "🎯 Target"
- Tambah target baru dengan nominal dan deadline
- Track progress secara real-time

### 5. **Analisis Keuangan**
- Buka halaman "📈 Analisis"
- Explore berbagai mode: Overview, Patterns, Predictions, Budget
- Gunakan insights untuk optimasi keuangan

### 6. **Demo Data (Testing)**
- Klik "🎲 Data Demo" untuk load sample data
- Explore semua fitur dengan data realistic
- Reset dengan "🗑️ Reset Data" jika diperlukan

## 📁 Struktur Project

```
budget-manager/
├── 📄 index.html          # Main HTML file
├── 💄 styles.css          # Styling (jika terpisah)
├── 🧠 app.js              # Main application logic
├── 📖 README.md           # Documentation
├── 📜 LICENSE             # MIT License
└── 🖼️ assets/             # Assets folder (jika ada)
    ├── 🎨 icons/          # Custom icons
    └── 📸 screenshots/    # App screenshots
```

### Key Components:
- **BudgetManager Class**: Core data management
- **ModernBudgetUI Class**: UI rendering dan event handling
- **LocalStorage Integration**: Data persistence
- **Responsive Layout**: Mobile-first design
- **Analytics Engine**: Predictive analysis

## 🤝 Kontribusi

Kontribusi sangat diterima! Berikut cara berkontribusi:

### 1. Fork Repository
```bash
git fork https://github.com/Erzambayu/budget-manager.git
```

### 2. Create Feature Branch
```bash
git checkout -b feature/AmazingFeature
```

### 3. Commit Changes
```bash
git commit -m 'Add some AmazingFeature'
```

### 4. Push & Pull Request
```bash
git push origin feature/AmazingFeature
```

### Guidelines:
- 🐛 **Bug Reports**: Gunakan template issue
- 💡 **Feature Requests**: Jelaskan use case dan benefit
- 📝 **Code Style**: Ikuti existing code patterns
- ✅ **Testing**: Test di multiple browsers dan devices

## 🗺️ Roadmap

### 🚧 Dalam Pengembangan
- [ ] 📊 Export data ke PDF/Excel
- [ ] 🔐 Cloud sync dengan authentication
- [ ] 💰 Multi-currency support
- [ ] 📅 Recurring transactions
- [ ] 🤖 Advanced AI recommendations

### 💭 Ideas untuk Future
- [ ] 📈 Investment portfolio tracking
- [ ] 🏪 Expense OCR dari foto receipt
- [ ] 📊 Advanced charting dengan Chart.js
- [ ] 🔔 Push notifications
- [ ] 👥 Family/shared budgets
- [ ] 🏦 Bank API integration

## 📄 Lisensi

Distributed under the MIT License. See `LICENSE` for more information.

```
MIT License

Copyright (c) 2024 Erzambayu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 📞 Kontak

**Erzambayu** - [@Erzambayu](https://github.com/Erzambayu)

Project Link: [https://github.com/Erzambayu/budget-manager](https://github.com/Erzambayu/budget-manager)

---

<div align="center">

**⭐ Jika project ini membantu, jangan lupa kasih star ya! ⭐**

Made with ❤️ by [Erzambayu](https://github.com/Erzambayu)

</div> 