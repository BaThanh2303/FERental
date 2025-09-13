import React from 'react';
import { Header } from './Header';
import { Hero } from './Hero';
import { Services } from './Services';
import { About } from './About';
import { Motorbikes } from './Motorbikes';
import { Testimonials } from './Testimonials';
import { Footer } from './Footer';


const Home = () => {
  return (
    <div>
      <Header />
      <Hero />
      <Motorbikes />
      <Services />
      {/* <About /> */}
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Home;

