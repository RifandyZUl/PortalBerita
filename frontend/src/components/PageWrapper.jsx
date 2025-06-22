import { motion as Motion } from 'framer-motion';

const PageWrapper = ({ children }) => {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      {children}
    </Motion.div>
  );
};

export default PageWrapper;
