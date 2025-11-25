import { Link } from 'react-router';

export default function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Link to="/" className="text-blue-500 hover:underline">
        Go back to home
      </Link>
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <p className="text-lg">Welcome to the dashboard</p>
    </div>
  );
}
