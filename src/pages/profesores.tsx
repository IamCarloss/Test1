import NavbarSidebar from "@/components/layout/NavSidebar";
import PageHeader from "@/components/layout/headers/PageHeader";
import LoaderModal from "@/components/loaders/loaderModal";
import LoaderSpinner from "@/components/loaders/loaderSpinner";
import AddProfessorModal from "@/components/modals/professors/AddProfessorModal";
import ProfessorAccordionItem from "@/components/profesores/ProfessorAccordionItem";
import { IProfessor } from "@/models/interfaces/professorInterface";
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

export default function Maestros() {
  let timeout: any;
  // ------- USESTATE ------- //
  const [professors, setProfessors] = useState<IProfessor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingTable, setIsLoadingTable] = useState<boolean>(true);
  const [errorTable, setErrorTable] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>("teacherName");
  const [search, setSearch] = useState<string>("");

  // ------- GET PROFESSORS FROM DB ------- //
  const getProfessors = async () => {
    setIsLoadingTable(true);

    try {
      const res = await fetch(
        `/api/professors?classification=${filter}&search=${search}&active=${active}`
      );
      const data = await res.json();

      if (res.status == 200) {
        setProfessors(data.professors);
      } else {
        setErrorTable(true);
      }
    } catch (error) {
      setErrorTable(true);
    }

    setIsLoadingTable(false);
  };

  // ------- INITIAL RENDER ------- //
  useEffect(() => {
    getProfessors();
  }, [active, search, filter]);

  return (
    <div>
      <NavbarSidebar>
        <Flex direction={"column"} p={5}>
          {/* // ----------------- HEADER ----------------- // */}
          <PageHeader title={"Listado de Docentes"}>
            <AddProfessorModal
              setIsLoading={setIsLoading}
              refreshTable={getProfessors}
            />
          </PageHeader>

          {/* // ----------------- FILTROS Y BUSQUEDA ----------------- // */}
          <Flex mt={6} mb={4} gap={2}>
            {/* ----------------- BOTON DE MAESTROS ACTIVOS/ARCHIVADOS ----------------- */}
            <Box>
              <Button
                colorScheme={active ? "green" : "red"}
                onClick={() => {
                  setActive(!active);
                }}
              >
                {active ? "Docentes Activos" : "Docentes Archivados"}
              </Button>
            </Box>

            {/* ----------------- FILTROS ----------------- */}
            <Box>
              <Select
                w={"250px"}
                borderColor={"green"}
                bg={"green.50"}
                fontWeight={"bold"}
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                }}
              >
                <option value="all">Todas las Clasificaciones</option>
                <option value="a">A</option>
                <option value="b">B</option>
                <option value="c">C</option>
                <option value="d">D</option>
                <option value="i">I</option>
              </Select>
            </Box>

            {/* ----------------- BARRA DE BUSQUEDA ----------------- */}
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

          {/* // ----------------- LISTA DE MAESTROS ----------------- // */}
          {isLoadingTable ? (
            <Flex h="calc(100vh - 350px)" justify={"center"} align={"center"}>
              <LoaderSpinner size="xl" />
            </Flex>
          ) : (
            <>
              {errorTable ? (
                <>ERROR</>
              ) : (
                <Box bg={"white"} rounded={"xl"} overflow={"hidden"}>
                  <Accordion allowMultiple>
                    {professors.map((profesor: IProfessor) => {
                      return (
                        <ProfessorAccordionItem
                          key={profesor._id}
                          professor={profesor}
                          setIsLoading={setIsLoading}
                          getProfessors={getProfessors}
                        />
                      );
                    })}
                  </Accordion>
                </Box>
              )}
            </>
          )}

          {/* // ----------------- NO TEACHERS FOUND ----------------- // */}
          {!isLoadingTable && professors.length == 0 && (
            <Flex h="calc(100vh - 300px)" justify={"center"} align={"center"}>
              <Heading fontSize={"lg"} color={"gray.500"} fontWeight={"normal"}>
                No se han encontrado docentes..
              </Heading>
            </Flex>
          )}
        </Flex>

        <LoaderModal isLoading={isLoading} />
      </NavbarSidebar>
    </div>
  );
}
