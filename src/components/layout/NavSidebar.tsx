import {
  Box,
  Divider,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import {
  FaBook,
  FaClock,
  FaHome,
  FaLock,
  FaSearchDollar,
  FaUniversity,
  FaUser,
} from "react-icons/fa";
import { HiAcademicCap } from "react-icons/hi";
import { MdAccountCircle } from "react-icons/md";
import SidebarLink from "./SidebarLink"; // Importa el componente SidebarLink

export interface INavSideBar {
  children?: React.ReactNode;
}

const NavbarSidebar: React.FC<INavSideBar> = ({ children }) => {
  const [showText, setShowText] = useState(false); // Estado para controlar si se muestra el texto en el Sidebar

  return (
    <Flex>
      {/*--SIDEBAR--*/}
      {/*--CONFIGURACIÓN DE ESTILO Y ANIMACIONES SIDEBAR--*/}
      <Box
        w={showText ? "250px" : "80px"} // Ancho condicional del Sidebar
        bg="#017413"
        color="white"
        p="6"
        maxH="100vh" // Altura mínima para mantener el Sidebar siempre visible
        transition="width 0.5s" // Transición suave para el cambio de ancho
        transitionDelay={showText ? "1s" : "0.0s"} // Retraso en la transición para que sea más suave
        onMouseEnter={() => setShowText(true)} // Mostrar texto al pasar el ratón por encima
        onMouseLeave={() => setShowText(false)} // Ocultar texto al quitar el ratón
        overflowY="auto"
      >
        <Flex direction="column">
          {/*--LINK DE PAGINA DE INICIO--*/}
          <SidebarLink
            href="/"
            icon={FaHome}
            label="Inicio"
            showText={showText}
          />
          <Divider mb="6" />
          {/*--LINK DE PAGINA DE PROFESORES--*/}
          <SidebarLink
            href="/profesores"
            icon={HiAcademicCap}
            label="Docentes"
            showText={showText}
          />
          <Divider mb="6" />
          {/*--LINK DE PAGINA DE CARRERAS--*/}
          <SidebarLink
            href="/carreras"
            icon={FaUniversity}
            label="Carreras"
            showText={showText}
          />
          <Divider mb="6" />
          {/*--LINK DE PAGINA DE MATERIAS--*/}
          <SidebarLink
            href="/materias"
            icon={FaBook}
            label="Materias"
            showText={showText}
          />
          <Divider mb="6" />
          {/*--LINK DE PAGINA DE GESTION SALARIAL--*/}
          <SidebarLink
            href="/gestion-salarial"
            icon={FaSearchDollar}
            label="Gestión Salarial"
            showText={showText}
          />
          <Divider mb="6" />
        </Flex>
      </Box>

      {/*--NAVBAR--*/}
      <Box flex="1">
        <Flex
          p="4"
          borderBottom="1px solid #017413"
          justifyContent="space-between"
          alignItems="center"
          bg="white"
        >
          {/*--LOGO DEL NAVBAR--*/}
          <Link href="/" passHref>
            <Flex alignItems="center">
              <img
                src={"/assets/logo.png"}
                alt="Logo"
                className="h-8 mr-2 cursor-pointer"
              />
            </Flex>
          </Link>
          {/*--OPCIONES DE CUENTA--*/}
          <Menu autoSelect={false}>
            <MenuButton
              as={IconButton}
              aria-label="Opciones de cuenta"
              icon={<FaUser />}
              variant="ghost"
              colorScheme="green"
              borderRadius={"full"}
              size="lg"
            />
            <MenuList>
              {/*--DETALLES DE CUENTA--*/}
              <MenuItem icon={<MdAccountCircle size={20} />}>
                Detalles de la cuenta
              </MenuItem>
              {/*--REGISTROS--*/}
              <MenuItem icon={<FaClock size={17} />}>Registros</MenuItem>

              <MenuDivider />
              {/*--CERRAR SESIÓN--*/}
              <MenuItem
                icon={<FaLock size={15} />}
                onClick={() => signOut()}
                color={"red.500"}
                fontWeight={"bold"}
              >
                Cerrar Sesión
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>

        {/* CONTENIDO DE LA PAGINA */}
        <Box overflowY="auto" height="calc(100vh - 81px)" px="4">
          {children}
        </Box>
      </Box>
    </Flex>
  );
};

export default NavbarSidebar;
