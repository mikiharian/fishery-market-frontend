Berikut Penjelasan mengapa saya memilih UI seperti yang ditampilkan:

## Layout

Mempertimbangkan field dari list data yang ditampilkan tidak terlalu banyak dan agar aplikasi dapat berjalan baik dan terlihat nyaman baik di desktop maupun mobile saya memberikan max width 420px untuk main layoutnya.
Hal ini bertujuan agar user merasa nyaman dan tetap fokus melihat konten web meskipun diakses melalui dekstop dan juga mobile friendly.

## Searchbox & Button Advanced Filter

Saya memposisikan searchbox dan button advanced filter dibawah header (diatas konten list harga) dengan position fixed, hal ini bertujuan agar mudah terlihat oleh user. karena menurut saya fitur search, sort dan filter merupakan yang terpenting ketika melihat katalog data.

## Modal Advanced Filter

Agar tidak membuat user bingung karena terlalu banyak action button di halaman katalog harga. saya mengelompokkan sort dan filter didalam modal filter yang dapat ditampilkan jika user mengklik icon filter disamping searchbox.
Selain itu, disini user dapat dengan mudah memanagement semua state filter yang ada.

## Commodity Price Item Card

dengan mengimplement infinity scroll saya menghindari terlalu banyak data yang diload pertama kali sehingga berpengaruh pada load speed. saya membatasi 50 data per load.
selain itu, di card item saya memposisikan konten harga di pojok kanan atas dan memberi font size, font weight dan color yang sedikit berbeda agar terlihat mencolok ketika user mengaksesnya.

## Button Add Data

Saya menampilkan button add data dengan position fixed bottom, hal ini bertujuan agar user dapat dengan mudah mengakses form tambah data terutama jika diakses melalui mobile.

## Modal Tambah Data

Saya menggunakan modal untuk menampilkan form tambah data, hal ini bertujuan agar user tidak perlu beralih kehalaman lain untuk menambah data sehingga user tetap berada dihalaman katalog harga setelah tambah data berhasil atau dibatalkan.
kemudian untuk field area dan size saya menggunakan dropdown untuk menghindari kesalahan input dari user dan juga mempermudah user dalam mengisi data.
