import React, { type PropsWithChildren } from 'react';
import Footer from './components/Footer';
import Header from './components/Header';

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <div>
      <Header />
      <main className='min-h-screen'>{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
