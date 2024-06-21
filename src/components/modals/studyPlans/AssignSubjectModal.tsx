import LoaderSpinner from "@/components/loaders/loaderSpinner";
import { IStudyPlan } from "@/models/interfaces/studyPlanInterface";
import { ISubject } from "@/models/interfaces/subjectInterface";
import { convertToTitleCase } from "@/utils/titleCase";
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  IconButton,
  Input,
  MenuItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { FaBook, FaBookOpen } from "react-icons/fa";

interface IAssignSubjectModalProps {
  studyPlan: IStudyPlan;
  reloadStudyPlan: Function;
}

export default function AssignSubjectModal({
  studyPlan,
  reloadStudyPlan,
}: IAssignSubjectModalProps) {
  // -------- HOOKS -------- //
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // -------- FUNCIONES -------- //
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [period, setPeriod] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<"all" | "selected">("all");
  const [filteredSubjects, setFilteredSubjects] = useState<ISubject[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<any[]>(
    studyPlan.subjects ? studyPlan.subjects : []
  );
  const [isTableLoading, setIsTableLoading] = useState<boolean>(true);
  const [subjectsLoading, setSubjectsLoading] = useState<boolean>(true);

  // -------- OBTENER MATERIAS -------- //
  const getSubjects = async () => {
    setIsTableLoading(true);
    setSubjectsLoading(true);

    try {
      const res = await fetch("/api/subjects");
      const data = await res.json();

      setSubjects(data.subjects);
    } catch (error) {
      console.log("Error al obtener las materias");
    }

    setSubjectsLoading(false);
  };

  const assignSubjects = async () => {
    try {
      const res = await fetch(`/api/studyPlans/${studyPlan._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subjects: selectedSubjects.map((subject) => subject._id),
        }),
      });

      if (res.status == 200) {
        toast({
          title: "Cambios guardados correctamente",
          description:
            "Los cambios a las materias del plan de estudios se han guardado correctamente.",
          variant: "left-accent",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        reloadStudyPlan();
        onClose();
      } else {
        toast({
          title: "Error al guardar los cambios",
          description:
            "Ha ocurrido un error al guardar los cambios a las materias del plan de estudios.",
          variant: "left-accent",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error al guardar los cambios",
        description:
          "Ha ocurrido un error al guardar los cambios a las materias del plan de estudios.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // -------- FILTRAR MATERIAS -------- //
  useEffect(() => {
    if (subjects.length === 0) {
      return;
    }

    const filtered = subjects.filter((subject: ISubject) => {
      if (period !== "all" && subject.period != parseInt(period)) {
        return false;
      }

      if (
        !subject.name.toLowerCase().includes(search.trim().toLowerCase()) &&
        !subject.key.toLowerCase().includes(search.trim().toLowerCase())
      ) {
        return false;
      }

      console.log(selectedSubjects);

      if (
        selectedSubjects.filter(
          (selectedSubject) => selectedSubject._id === subject._id
        ).length == 0 &&
        (filter === "selected" || subject.active == false)
      ) {
        return false;
      }

      return true;
    });

    setFilteredSubjects(filtered);

    setIsTableLoading(false);
  }, [period, subjects, search, filter, selectedSubjects]);

  return (
    <>
      {/* // -------- BOTON PARA ABRIR MODAL -------- // */}
      <MenuItem
        icon={<FaBook />}
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
          getSubjects();
        }}
      >
        Asignar Materia
      </MenuItem>

      {/* // -------- MODAL -------- // */}
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setSelectedSubjects(studyPlan.subjects ? studyPlan.subjects : []);
          onClose();
        }}
        size={"6xl"}
        closeOnEsc={false}
        closeOnOverlayClick={false}
        onOverlayClick={() =>
          toast({
            title: "No se ha asignado ninguna materia",
            description:
              "Para cerrar el modal, sin haber asignado ninguna materia, presiona el botón 'Cancelar' o en la x de la esquina superior derecha.",
            variant: "left-accent",
            status: "info",
            duration: 3000,
            isClosable: true,
          })
        }
      >
        <ModalOverlay />
        <ModalContent>
          {/* // - MODAL HEADER - // */}
          <ModalHeader fontWeight={"bold"}>
            Asignar Materias - {convertToTitleCase(studyPlan.name)}
          </ModalHeader>
          <ModalCloseButton />
          <Divider />

          {/* // - MODAL BODY - // */}
          <ModalBody py={4}>
            <Box textAlign={"center"}>
              Se han seleccionado{" "}
              <strong>{selectedSubjects.length} materias</strong> para ser
              asignadas al plan de estudios.
            </Box>

            <Box mt={4} mx={10}>
              <Divider borderColor={"green.500"} />
            </Box>

            {/* // -------- FILTROS Y BARRA DE BUSQUEDA -------- // */}
            <Flex gap={2} mt={4}>
              {/* // -------- FILTRO POR PERIODO -------- // */}
              <Box w={"250px"}>
                <Select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                >
                  <option value="all">Todos los Periodos</option>
                  <option value="1">1 - Primer Periodo</option>
                  <option value="2">2 - Segundo Periodo</option>
                  <option value="3">3 - Tercer Periodo</option>
                  <option value="4">4 - Cuarto Periodo</option>
                  <option value="5">5 - Quinto Periodo</option>
                  <option value="6">6 - Sexto Periodo</option>
                  <option value="7"> 7 - Septimo Periodo</option>
                  <option value="8">8 - Octavo Periodo</option>
                  <option value="9">9 - Noveno Periodo</option>
                </Select>
              </Box>

              {/* // -------- BARRA DE BUSQUEDA -------- // */}
              <FormControl>
                <Input
                  type="text"
                  placeholder="Buscar materia por nombre o clave..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
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

              {/* // -------- BOTON DE MOSTRAR MATERIAS SELECCIONADAS -------- // */}
              <Box>
                {filter === "selected" ? (
                  <Tooltip
                    hasArrow
                    label="Mostrar todas las materias"
                    placement="top"
                  >
                    <IconButton
                      aria-label="Mostrar todas"
                      icon={<FaBook />}
                      onClick={() => setFilter("all")}
                    />
                  </Tooltip>
                ) : (
                  <Tooltip
                    hasArrow
                    label="Mostrar materias seleccionadas"
                    placement="top"
                  >
                    <IconButton
                      colorScheme="green"
                      aria-label="Mostrar seleccionadas"
                      icon={<FaBookOpen />}
                      onClick={() => setFilter("selected")}
                    />
                  </Tooltip>
                )}
              </Box>
            </Flex>

            {/* // -------- MENSAJE DE NO HAY MATERIAS -------- // */}
            {!subjectsLoading && !isTableLoading && subjects.length === 0 && (
              <Box textAlign={"center"} mt={4}>
                No se han encontrado materias...
              </Box>
            )}

            {/* // -------- LOADER -------- // */}
            {isTableLoading && <LoaderSpinner paddingY={"3rem"} />}

            {/* // -------- TABLA DE MATERIAS -------- // */}
            {!isTableLoading && subjects.length > 0 && (
              <TableContainer
                mt={4}
                w={"full"}
                maxH={"50vh"}
                overflowY={"auto"}
                overflowX={"hidden"}
              >
                <Table colorScheme="green">
                  <Thead
                    position={"sticky"}
                    top={0}
                    bgColor={"white"}
                    zIndex={10}
                  >
                    <Tr>
                      <Th>Nombre</Th>
                      <Th>Clave</Th>
                      <Th isNumeric>Periodo</Th>
                      <Th isNumeric>Acciones</Th>
                    </Tr>
                  </Thead>

                  <Tbody>
                    {filteredSubjects.map((subject: ISubject) => (
                      <Tr key={subject._id}>
                        {/* // -------- NOMBRE DE LA MATERIA -------- // */}
                        <Td fontWeight={"bold"}>
                          {convertToTitleCase(subject.name)}
                        </Td>

                        {/* // -------- CLAVE DE LA MATERIA -------- // */}
                        <Td>
                          <em>{subject.key}</em>
                        </Td>

                        {/* // -------- PERIODO DE LA MATERIA -------- // */}
                        <Td isNumeric>{subject.period}</Td>

                        {/* // -------- BOTON DE ASIGNAR/QUITAR -------- // */}
                        <Td isNumeric>
                          {selectedSubjects.filter(
                            (selectedSubject) =>
                              selectedSubject._id == subject._id
                          ).length > 0 ? (
                            <Button
                              size={"sm"}
                              colorScheme={"red"}
                              onClick={() => {
                                setSelectedSubjects(
                                  selectedSubjects.filter(
                                    (selectedSubject) =>
                                      selectedSubject._id !== subject._id
                                  )
                                );
                              }}
                            >
                              Quitar
                            </Button>
                          ) : (
                            <Button
                              size={"sm"}
                              colorScheme={"green"}
                              onClick={() => {
                                setSelectedSubjects([
                                  ...selectedSubjects,
                                  subject,
                                ]);
                              }}
                            >
                              Seleccionar
                            </Button>
                          )}
                        </Td>
                      </Tr>
                    ))}

                    {/* // -------- MENSAJE DE NO HAY MATERIAS -------- // */}
                    {filteredSubjects.length === 0 && (
                      <Tr>
                        <Td colSpan={4} textAlign={"center"} color={"gray.500"}>
                          No hay materias que mostrar...
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
          </ModalBody>

          {/* // - MODAL FOOTER - // */}
          <Divider />
          <ModalFooter>
            <Button
              variant={"ghost"}
              mr={3}
              onClick={() => {
                setSelectedSubjects(
                  studyPlan.subjects ? studyPlan.subjects : []
                );
                onClose();
              }}
            >
              Cancelar
            </Button>
            <Button colorScheme="green" onClick={assignSubjects}>
              Asignar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
