import AppLayout from '@web-react/layouts/app-layout';
import { Link } from 'react-router';
import { useContext } from 'react';
import authContext from '../context/auth-context';
import { Button } from '@web-react/components/ui/button';

export default function Home() {
  const auth = useContext(authContext);

  return (
    <AppLayout>
      <title>Home</title>
      <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
        <nav className="flex items-center justify-end gap-4">
          <>
            {auth?.isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                >
                  Dashboard
                </Link>
                <Button variant="outline" onClick={() => auth.logout()}>
                  Log out
                </Button>
              </>
            )}
            {!auth?.isAuthenticated && (
              <>
                <Link
                  to="/login"
                  className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                >
                  Register
                </Link>
              </>
            )}
          </>
        </nav>
      </header>
      <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
        <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-4xl lg:flex-row">
          <h1>Node Express Hub</h1>
        </main>
      </div>
    </AppLayout>
  );
}
