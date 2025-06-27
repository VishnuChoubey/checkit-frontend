import React from "react";
import { motion } from "framer-motion";

const Sidebar = ({ open, setOpen }) => {
  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: "-100%" },
  };

  return (
    <motion.div
      className="fixed top-0 left-0 h-full w-80 bg-gray-200 shadow-2xl rounded-3xl"
      initial="closed"
      animate={open ? "open" : "closed"}
      variants={sidebarVariants}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="p-6">
        <h2 className="text-2xl mb-4">Menu</h2>
        <ul className="space-y-4">
          <li className="hover:bg-gray-300 p-3 rounded-lg cursor-pointer">Your Ticket and Passes</li>
          <li className="hover:bg-gray-300 p-3 rounded-lg cursor-pointer">Change City</li>
          <li className="hover:bg-gray-300 p-3 rounded-lg cursor-pointer">Support</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default Sidebar;
