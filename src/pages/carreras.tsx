import CareerAccordionItem from "@/components/careers/CareerAccordionItem";
import NavbarSidebar from "@/components/layout/NavSidebar";
import PageHeader from "@/components/layout/headers/PageHeader";
import LoaderModal from "@/components/loaders/loaderModal";
import LoaderSpinner from "@/components/loaders/loaderSpinner";
import AddCareerModal from "@/components/modals/careers/AddCareerModal";
import {
  Accordion,
  Box,
  Button,
  Flex,
  FormControl,
  Heading,
  Input,
  Select,
} from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import { getToken } from "next-auth/jwt";
import { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  // ------- CHECAR TOKEN DE SESION ------- //
  const token = await getToken({ req: context.req });

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default function Carreras() {
  // -------- HOOKS -------- //
  let timeout: any;

  // -------- USESTATES -------- //
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingTable, setIsLoadingTable] = useState<boolean>(true);
  const [careers, setCareers] = useState<ICareer[]>([]);
  const [active, setActive] = useState<boolean>(true);
  const [academicLevel, setAcademicLevel] = useState<string>("all");
  const [filter, setFilter] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  // -------- OBTENER CARRERAS -------- //
  const getCareers = async () => {
    setIsLoadingTable(true);

    try {
      const res = await fetch(
        `/api/careers?active=${active}&academicLevel=${academicLevel}&filter=${filter}&search=${search}`
      );

      if (res.status == 200) {
        const data = await res.json();
        setCareers(data.careers);
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoadingTable(false);
  };

  // -------- INITIAL RENDER -------- //
  useEffect(() => {
    getCareers();
  }, [active, academicLevel, search, filter]);

  return (
    <NavbarSidebar>
      <Box p={5}>
        {/* // -------- HEADER DE LA PAGINA -------- // */}
        <PageHeader title={"Listado de Carreras"}>
          {/* // -------- BOTON PARA ABRIR MODAL DE REGISTRO DE CARRERA -------- // */}
          <AddCareerModal
            setIsLoading={setIsLoading}
            refreshTable={getCareers}
          />
        </PageHeader>

        <Flex direction={"column"}>
          {/* // -------- Barra de Busqueda y Filtros -------- // */}
          <Flex mt={6} mb={4} gap={2}>
            <Box>
              <Button
                colorScheme={active ? "green" : "red"}
                onClick={() => {
                  setActive(!active);
                }}
              >
                {active ? "Carreras Activas" : "Carreras Archivadas"}
              </Button>
            </Box>

            {/* // -------- FILTRO POR NIVEL ACADEMICO -------- // */}
            <Box w={"350px"}>
              <Select
                variant={"filled"}
                borderColor={"green"}
                bg={"green.50"}
                fontWeight={"bold"}
                value={academicLevel}
                onChange={(e) => {
                  setAcademicLevel(e.target.value);
                }}
              >
                <option value="">Todos los niveles</option>
                <option value="primaria">Primaria</option>
                <option value="secundaria">Secundaria</option>
                <option value="bachillerato">Bachillerato</option>
                <option value="universidad">Universidad</option>
                <option value="nocturna">Universidad Nocturna</option>
                <option value="virtual">Universidad Virtual</option>
                <option value="posgrado">Posgrado</option>
                <option value="taller">Taller</option>
              </Select>
            </Box>

            {/* // -------- FILTRO DE BUSQUEDA -------- // */}
            <Box w={"300px"}>
              <Select
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                }}
              >
                <option value="name">Nombre</option>
                <option value="careerCode">Codigo</option>
              </Select>
            </Box>

            {/* // -------- CAMPO DE BUSQUEDA -------- // */}
            <FormControl>
              <Input
                type="text"
                placeholder="Buscar docente por nombre..."
                onKeyDown={(e: any) => {
                  clearTimeout(timeout);
                  timeout = setTimeout(() => {
                    setSearch(e.target.value);
                    clearTimeout(timeout);
                  }, 250);
                }}
                py={2}
                pl={10}
                pr={4}
                border="1px"
                borderColor="gray.300"
                rounded="md"
                focusBorderColor="green.600"
              />
              <Box
                position="absolute"
                insetY={0}
                left={0}
                pl={3}
                display="flex"
                alignItems="center"
              >
                {/* Icono de búsqueda */}
                <AiOutlineSearch color="gray.400" />
              </Box>
            </FormControl>
          </Flex>

          {/* // -------- Listado de Carreras -------- // */}
          <Flex direction={"column"} my={4}>
            {isLoadingTable && (
              <Flex h="calc(100vh - 350px)" justify={"center"} align={"center"}>
                <LoaderSpinner size="xl" />
              </Flex>
            )}

            {!isLoadingTable && careers.length > 0 && (
              <Box bg={"white"} rounded={"xl"} overflow={"hidden"}>
                <Accordion allowMultiple allowToggle reduceMotion={false}>
                  {careers.map((career) => {
                    return (
                      <CareerAccordionItem
                        key={career._id}
                        career={career}
                        active={active}
                        getCareers={getCareers}
                        setIsLoading={setIsLoading}
                      />
                    );
                  })}
                </Accordion>
              </Box>
            )}

            {/* // ----------------- NO MATCHES ----------------- // */}
            {!isLoadingTable && careers.length == 0 && (
              <Flex h="calc(100vh - 300px)" justify={"center"} align={"center"}>
                <Heading
                  fontSize={"lg"}
                  color={"gray.500"}
                  fontWeight={"normal"}
                >
                  No se han encontrado registros...
                </Heading>
              </Flex>
            )}
          </Flex>
        </Flex>
      </Box>

      <LoaderModal isLoading={isLoading} />
    </NavbarSidebar>
  );
}
