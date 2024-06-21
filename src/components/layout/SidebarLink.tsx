import { Box, Flex, Slide } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { IconType } from "react-icons";

interface SidebarLinkProps {
  href: string;
  icon: IconType;
  label: string;
  showText: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  href,
  icon: Icon,
  label,
  showText,
}) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <Box mb="6">
      <Link href={href} passHref>
        <Flex
          alignItems="center"
          className={`text-m sidebar-link ${
            isActive ? "font-bold" : ""
          } transition-transform transform hover:scale-110`}
        >
          <Icon size={25} />
          {showText && (
            <Slide direction="right" in={showText}>
              <Box ml="10" className="truncate">
                {label}
              </Box>
            </Slide>
          )}
        </Flex>
      </Link>
    </Box>
  );
};

export default SidebarLink;
