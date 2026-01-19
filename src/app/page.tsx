import { redirect } from 'next/navigation';

// [DOCS] Halaman Root (/).
// Otomatis redirect ke halaman login karena aplikasi ini membutuhkan autentikasi sejak awal.
export default function RootPage() {
  redirect('/login');
}