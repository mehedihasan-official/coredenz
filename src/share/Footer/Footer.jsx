import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaReact } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import logo from '../../assets/images/CoreDenz-logo.png';

const Footer = () => {
    return (
        <footer className=" bg-gray-900 text-white pt-12 pb-6 px-4 sm:px-6 lg:px-8">
            <div className="
             mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Company Info */}
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Image
                            src={logo}
                            alt="CoreDenz"
                            width={logo.width}
                            height={logo.height}
                            className="h-auto w-52"
                        />
                    </div>
                    <p className="text-gray-400 text-start">
                        Your one-stop shop for the latest and greatest products. Shop with confidence and enjoy fast delivery!
                    </p>
                    <div className="flex space-x-4">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors">
                            <FaFacebook className="text-xl" />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                            <FaTwitter className="text-xl" />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 transition-colors">
                            <FaInstagram className="text-xl" />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                            <FaLinkedin className="text-xl" />
                        </a>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="space-y-4">
                    <h4 className="text-lg font-semibold">Quick Links</h4>
                    <ul className="space-y-2">
                        <li><Link href="/products" className="text-gray-400 hover:text-white transition-colors">Shop</Link></li>
                        <li><Link href="/services" className="text-gray-400 hover:text-white transition-colors">Services</Link></li>
                        <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                        <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
                        <li><Link href="/orders" className="text-gray-400 hover:text-white transition-colors">Orders</Link></li>
                    </ul>
                </div>

                {/* Customer Service */}
                <div className="space-y-4">
                    <h4 className="text-lg font-semibold">Customer Service</h4>
                    <ul className="space-y-2">
                        <li><Link href="/orders" className="text-gray-400 hover:text-white transition-colors">Track an Order</Link></li>
                        <li><Link href="/profile" className="text-gray-400 hover:text-white transition-colors">My Account</Link></li>
                        <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Support</Link></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div className="space-y-4">
                    <h4 className="text-lg font-semibold">Contact Us</h4>
                    <div className="space-y-3 text-gray-400">
                        <div className="flex items-start space-x-3">
                            <FaMapMarkerAlt className="mt-1 flex-shrink-0" />
                            <span>Mirpur, Dhaka</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <FaPhone />
                            <a href="+8801316265634" className="hover:text-white transition-colors">+880 1316265634</a>
                        </div>
                        <div className="flex items-center space-x-3">
                            <FaEnvelope />
                            <a href="mailto:mehedihasanshopnil.jr@gmail.com" className="hover:text-white transition-colors">mehedihasanshopnil.jr@gmail.com</a>
                        </div>
                        
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-800 mt-12 pt-6 text-center text-gray-500 text-sm">
                <p>&copy; {new Date().getFullYear()} Coredenz. All rights reserved.</p>
                
            </div>
        </footer>
    );
};

export default Footer;