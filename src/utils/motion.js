export const motionEase = [0.22, 1, 0.36, 1]

export const entranceTransition = {
  duration: 0.38,
  ease: motionEase,
}

export const springTransition = {
  type: 'spring',
  stiffness: 280,
  damping: 24,
  mass: 0.9,
}

export const sectionStagger = (delayChildren = 0) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren,
    },
  },
})

export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: entranceTransition,
  },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.28,
      ease: motionEase,
    },
  },
}

export const cardHover = {
  y: -4,
  scale: 1.025,
  boxShadow: '0 28px 70px -34px rgba(15, 23, 42, 0.42)',
}

export const rowHover = {
  y: -1,
  scale: 1.004,
}

export const buttonHover = {
  y: -1,
  scale: 1.02,
  filter: 'brightness(1.03)',
}

export const buttonTap = {
  scale: 0.985,
}
