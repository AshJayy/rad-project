import Logo from "./Logo";
import { Link } from "react-router-dom";
import { Button, Dropdown, Navbar } from "flowbite-react";
import { HiChevronDown } from "react-icons/hi";

export default function Header() {
  const dropDownItems = [
    {
      name: "Product 1",
      path: "#"
    },
    {
      name: "Product 2",
      path: "#"
    },
    {
      name: "Product 3",
      path: "#"
    },
  ]
  return (
    <Navbar className="px-10 py-6">
        <div className="flex gap-16 items-center">
          <Logo />

          <div className="flex gap-8">

            <Dropdown
              label=""
              dismissOnClick={false}
              renderTrigger={() =>
              <span className="flex items-center gap-2 text-sm font-medium cursor-pointer text-dark-blue hover:text-mid-blue">
                Products
                <HiChevronDown />
              </span>
            }
            >
              {dropDownItems.map((item, index) => (
                <Link key={index} to={item.path}>
                  <Dropdown.Item>{item.name}</Dropdown.Item>
                </Link>
              ))}
            </Dropdown>

            <Navbar.Toggle />

            <Navbar.Collapse>
              <Navbar.Link as={'div'}>
                <Link to={'/pricing'} className="text-sm font-medium text-dark-blue hover:text-mid-blue">
                  Pricing
                </Link>
              </Navbar.Link>
              <Navbar.Link as={'div'}>
                <Link to={'/about'} className="text-sm font-medium text-dark-blue hover:text-mid-blue">
                  About
                </Link>
              </Navbar.Link>
            </Navbar.Collapse>
          </div>

        </div>

        <div className="flex gap-8 items-center text-sm">

          <span><Link to={'/signin'}>Log In</Link></span>

          <Button className="bg-mid-blue" pill>
            <Link to={'/freetrial'}>Start free trial</Link>
          </Button>

        </div>
    </Navbar>
  )
}
