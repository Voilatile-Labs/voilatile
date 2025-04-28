"use client";

import GithubIcon from "@/assets/icons/github";
import TwitterIcon from "@/assets/icons/twitter";
import DiscordIcon from "@/assets/icons/discord";
import React from "react";
import { motion } from "framer-motion";

export const socialIconHoverAnimation = {
  whileHover: {
    scale: 1.2,
    rotate: [0, -10, 10, 0],
    transition: { duration: 0.4 },
  },
  initial: { rotate: 0 },
  animate: { rotate: 0 },
};

const Links = [
  {
    label: "App",
    href: "app",
    item: [
      {
        label: "Trade",
        href: "#trade",
      },
      {
        label: "Explore",
        href: "#explore",
      },
      {
        label: "Pool",
        href: "#pool",
      },
    ],
  },
  {
    label: "Company",
    href: "company",
    item: [
      {
        label: "Careers",
        href: "#careers",
      },
      {
        label: "Blog",
        href: "#blog",
      },
      {
        label: "Brand assets",
        href: "#brand-assets",
      },
    ],
  },
  {
    label: "Protocol",
    href: "protocol",
    item: [
      {
        label: "Vote",
        href: "#vote",
      },
      {
        label: "Governance",
        href: "#governance",
      },
      {
        label: "Developers",
        href: "#developers",
      },
    ],
  },
  {
    label: "Need help?",
    href: "need-help",
    item: [
      {
        label: "Help center",
        href: "#help-center",
      },
      {
        label: "Contact us",
        href: "#contact-us",
      },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="w-full p-6 pt-10 text-sm">
      <div className="flex flex-end">
        <div className="flex flex-col sm:flex-row flex-1 justify-end gap-4 sm:gap-12 flex-wrap">
          {Links.map((link) => {
            return (
              <div key={link.label}>
                <div className="font-semibold mb-2">{link.label}</div>
                <ul className="space-y-1 text-gray-600">
                  {link.item.map((item) => (
                    <li key={item.label}>
                      <a href={item.href}>{item.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between mt-8 border-t border-gray-100 pt-4 text-xs text-gray-600">
        <div className="mb-2 md:mb-0">© 2024 - Voilatile</div>

        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <motion.a href="#" aria-label="GitHub" {...socialIconHoverAnimation}>
            <GithubIcon className="w-[22px] h-[22px] hover:fill-blue-500" />
          </motion.a>
          <motion.a href="#" aria-label="X" {...socialIconHoverAnimation}>
            <TwitterIcon className="w-[20px] h-[20px] hover:fill-blue-500" />
          </motion.a>
          <motion.a href="#" aria-label="Discord" {...socialIconHoverAnimation}>
            <DiscordIcon className="w-[20px] h-[20px] hover:fill-blue-500" />
          </motion.a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
