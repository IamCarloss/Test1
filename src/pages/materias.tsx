import NavbarSidebar from "@/components/layout/NavSidebar";
import PageHeader from "@/components/layout/headers/PageHeader";
import LoaderModal from "@/components/loaders/loaderModal";
import LoaderSpinner from "@/components/loaders/loaderSpinner";
import SubjectAccordionItem from "@/components/materias/SubjectAccordionItem";
import AddMateriasModal from "@/components/modals/materias/AddMateriasModal";
import { ISubject } from "@/models/interfaces/subjectInterface";
import {
  Accordion,
  Box,
  Button,
  Flex,
  FormControl,
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

const Materias = () => {
  let timeout: any;

  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingTable, setIsLoadingTable] = useState<boolean>(true);
  const [errorTable, setErrorTable] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(true);
  const [period, setPeriod] = useState<string>("Todos");
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<string>("name");

  const getSubjects = async () => {
    setIsLoadingTable(true);

    try {
      const res = await fetch(
        `/api/subjects?search=${search}&active=${active}&filter=${filter}&period=${period}`
      );
      const data = await res.json();

      if (res.status === 200) {
        setSubjects(data.subjects);
      } else {
        setErrorTable(true);
      }
    } catch (error) {
      setErrorTable(true);
    }

    setIsLoadingTable(false);
  };

  useEffect(() => {
    getSubjects();
  }, [active, search, filter, period]);

  return (
    <NavbarSidebar>
      <Flex direction={"column"} p={5}>
        <PageHeader title={"Listado de materias"}>
          <AddMateriasModal
            setIsLoading={setIsLoading}
            refreshTable={getSubjects}
          />
        </PageHeader>
        <Flex mt={6} mb={4} gap={2}>
          <Box>
            <Button
              colorScheme={active ? "green" : "red"}
              onClick={() => {
                setActive(!active);
              }}
            >
              {active ? "Materias activas" : "Materias archivadas"}
            </Button>
          </Box>
          {/* ----------------- FILTRO POR PERIODO ----------------- */}
          <Box>
            <Select
              w={"250px"}
              borderColor={"green"}
              bg={"green.50"}
              fontWeight={"bold"}
              value={period}
              onChange={(e) => {
                setPeriod(e.target.value);
              }}
            >
              <option value="">Todos los periodos</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
            </Select>
          </Box>
          {/* ----------------- FILTRO POR NOMBRE O CLAVE ----------------- */}
          <Box>
            <Select
              w={"250px"}
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
              }}
            >
              <option value="name">Nombre</option>
              <option value="key">Clave</option>
            </Select>
          </Box>

          <FormControl>
            <Input
              type="text"
              placeholder={`Buscar materia por ${
                filter === "name" ? "nombre" : "clave"
              }...`}
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
              <AiOutlineSearch color="gray.400" />
            </Box>
          </FormControl>
        </Flex>

        {isLoadingTable ? (
          <LoaderSpinner size="xl" paddingY="10rem" />
        ) : (
          <>
            {errorTable ? (
              <>ERROR</>
            ) : (
              <Box bg={"white"} rounded={"xl"} overflow={"hidden"}>
                <Accordion allowMultiple>
                  {subjects.map((subject: ISubject) => (
                    <SubjectAccordionItem
                      key={subject._id}
                      subject={subject}
                      setIsLoading={setIsLoading}
                      getSubjects={getSubjects}
                    />
                  ))}
                </Accordion>
              </Box>
            )}
          </>
        )}
      </Flex>

      <LoaderModal isLoading={isLoading}></LoaderModal>
    </NavbarSidebar>
  );
};

export default Materias;
