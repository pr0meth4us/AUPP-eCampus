import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar
} from "@heroui/react";
import { GraduationCap, LogIn, UserPlus, LogOut, User, BookOpen } from "lucide-react";
import { useAuth } from "context/authContext";

const Header = ({ onLoginOpen, onSignupOpen }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, logout } = useAuth();

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "All Courses", href: "/course-catalog" },
    { name: "About Us", href: "/about" },
  ];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} maxWidth="xl" isBordered>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href="/" className="flex items-center gap-2 text-inherit">
            <GraduationCap className="text-primary" size={32} />
            <p className="font-bold text-inherit text-xl">AUPP eCampus</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop Navigation */}
      <NavbarContent className="hidden sm:flex gap-8" justify="center">
        {menuItems.map((item) => (
          <NavbarItem key={item.name}>
            <Link color="foreground" href={item.href} className="text-sm font-medium">
              {item.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        {!user ? (
          <>
            <NavbarItem className="hidden lg:flex">
              <Button variant="light" onPress={onLoginOpen} startContent={<LogIn size={18}/>}>
                Login
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button
                color="primary"
                onPress={onSignupOpen}
                variant="flat"
                startContent={<UserPlus size={18}/>}
              >
                Sign Up
              </Button>
            </NavbarItem>
          </>
        ) : (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="primary"
                name={user.name}
                size="sm"
                src={user.avatar}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold text-primary">{user.email}</p>
              </DropdownItem>
              <DropdownItem key="dashboard" startContent={<BookOpen size={16}/>} href="/my-courses">
                My Courses
              </DropdownItem>
              <DropdownItem key="settings" startContent={<User size={16}/>} href={`/profile/${user.id}`}>
                Profile Settings
              </DropdownItem>
              <DropdownItem
                key="logout"
                color="danger"
                startContent={<LogOut size={16}/>}
                onPress={logout}
              >
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <Link
              color="foreground"
              className="w-full text-lg py-2"
              href={item.href}
              size="lg"
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
        {!user && (
          <NavbarMenuItem>
            <Button color="primary" variant="flat" className="w-full" onPress={onLoginOpen}>
              Login / Sign Up
            </Button>
          </NavbarMenuItem>
        )}
      </NavbarMenu>
    </Navbar>
  );
};

export default Header;