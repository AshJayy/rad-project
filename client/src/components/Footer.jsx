import { Link } from "react-router-dom";
import {Footer} from 'flowbite-react'
import { AiFillInstagram } from "react-icons/ai";
import { FaFacebook, FaLinkedin, FaRegCopyright } from "react-icons/fa";
import Logo from './Logo.jsx'

export default function FooterComp() {
  return (
    <Footer className='p-16 flex flex-col max-w-6xl shadow-none mx-auto text-dark-blue'>
        <div className='flex flex-row justify-between w-full'>
            <div>
                <Logo />
            </div>
            <div className='grid grid-cols-3 gap-4'>
                <div>
                    <Footer.LinkGroup col>
                        <Footer.Link
                            href='#'
                            className='text-dark-blue font-semibold pb-2 text-sm'
                        >
                            Help Center
                        </Footer.Link>
                        <Footer.Link
                            href='#'
                            className='text-dark-blue font-semibold pb-2 text-sm'
                        >
                            Information for candidates
                        </Footer.Link>
                        <Footer.Link
                            href='#'
                            className='text-dark-blue font-semibold pb-2 text-sm'
                        >
                            Sitemap
                        </Footer.Link>
                    </Footer.LinkGroup>
                </div>
                <div>
                    <Footer.LinkGroup col>
                        <Footer.Link
                            href='#'
                            className='text-dark-blue font-semibold pb-2 text-sm'
                        >
                            Legal
                        </Footer.Link>
                        <Footer.Link
                            href='#'
                            className='text-dark-blue font-semibold pb-2 text-sm'
                        >
                            Careers
                        </Footer.Link>
                        <Footer.Link
                            href='#'
                            className='text-dark-blue font-semibold pb-2 text-sm'
                        >
                            Hiring!
                        </Footer.Link>
                    </Footer.LinkGroup>
                </div>
                <div>
                    <Footer.LinkGroup col>
                        <Footer.Link
                            href='#'
                            className='text-dark-blue font-semibold pb-2 text-sm'
                        >
                            Blog
                        </Footer.Link>
                        <Footer.Link
                            href='#'
                            className='text-dark-blue font-semibold pb-2 text-sm'
                        >
                            Contact
                        </Footer.Link>
                        <Footer.Link
                            href='#'
                            className='text-dark-blue font-semibold pb-2 text-sm'
                        >
                            Privacy Policy
                        </Footer.Link>
                    </Footer.LinkGroup>
                </div>
            </div>
        </div>
        <Footer.Divider className="border-dark-blue" />
        <div className="flex flex-row gap-4">
            <div className="flex flex-row gap-2">
                <Link>
                    <FaLinkedin className="w-6 h-6" />
                </Link>
                <Link>
                    <FaFacebook className="w-6 h-6" />
                </Link>
                <Link>
                    <AiFillInstagram className="w-6 h-6" />
                </Link>
            </div>
            <div className="flex gap-2 items-center">
                <FaRegCopyright />
                <span className="text-sm font-bold">
                    2024 ExamEase. All rights reserved.
                </span>
            </div>
        </div>
    </Footer>
  )
}
