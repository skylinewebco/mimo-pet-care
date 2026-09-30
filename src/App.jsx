import { useCallback, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import { ImageStoreProvider } from './lib/ImageStore'
import useLenis from './hooks/useLenis'
import useReducedMotion from './hooks/useReducedMotion'
import LoadingScreen from './components/LoadingScreen'
import CustomCursor from './components/CustomCursor'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import WhyChooseUs from './components/WhyChooseUs'
import CloudBanner from './components/CloudBanner'
import Services from './components/Services'
import Pricing from './components/Pricing'
import MobileGrooming from './components/MobileGrooming'
import Gallery from './components/Gallery'
import Groomers from './components/Groomers'
import Testimonials from './components/Testimonials'
import Booking from './components/Booking'
import FAQ from './components/FAQ'
import Contact from './components/Contact'
import Footer from './components/Footer'
import FloatingWhatsApp from './components/FloatingWhatsApp'
import BackToTop from './components/BackToTop'
import { EditToolbar, ImagePickerModal } from './components/EditMode'

export default function App() {
  const reduced = useReducedMotion()
  const [ready, setReady] = useState(false)
  const onLoaded = useCallback(() => setReady(true), [])
  useLenis(reduced)

  return (
    <MotionConfig reducedMotion="user">
      <ImageStoreProvider>
        <LoadingScreen onDone={onLoaded} />
        <CustomCursor />
        <Navbar />
        <main id="main">
          <Hero ready={ready} />
          <WhyChooseUs />
          <CloudBanner />
          <Services />
          <Pricing />
          <MobileGrooming />
          <Gallery />
          <Groomers />
          <Testimonials />
          <Booking />
          <FAQ />
          <Contact />
        </main>
        <Footer />
        <FloatingWhatsApp />
        <BackToTop />
        <EditToolbar />
        <ImagePickerModal />
      </ImageStoreProvider>
    </MotionConfig>
  )
}
