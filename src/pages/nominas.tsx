// Importación de componentes y librerías necesarios
import NavbarSidebar from "@/components/layout/NavSidebar";
import PageHeader from "@/components/layout/headers/PageHeader";
import { db } from "@/utils/dbSimulation";
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  Heading,
  IconButton,
  Input,
  Menu,
  MenuButton,
  Stack,
} from "@chakra-ui/react"; // Importación de componentes de Chakra UI
import { GetServerSidePropsContext } from "next"; // Importación del contexto para props del lado del servidor
import { getToken } from "next-auth/jwt"; // Importación de la función getToken de next-auth/jwt para obtener el token de autenticación
import { useState } from "react"; // Importación del hook useState de React
import { AiOutlineSearch } from "react-icons/ai"; // Importación del icono AiOutlineSearch de react-icons
import { FaDotCircle, FaTrash } from "react-icons/fa"; // Importación de los iconos FaDotCircle y FaTrash de react-icons
import * as XLSX from "xlsx"; // Importación de la librería XLSX para manipular archivos Excel

// Función para obtener props del lado del servidor
export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const token = await getToken({ req: context.req });

  // Si no hay token, redirecciona a la página de inicio de sesión
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

// Componente principal para la página de nóminas
const Nominas = () => {
  // Estado para almacenar los maestros seleccionados
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  // Estado para almacenar las materias seleccionadas por cada maestro
  const [selectedSubjects, setSelectedSubjects] = useState<{
    [key: string]: string[];
  }>({});
  // Estados para almacenar las fechas de inicio y fin del período de búsqueda
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // Estado para almacenar el término de búsqueda por nombre de maestro
  const [searchTerm, setSearchTerm] = useState("");

  // Función para eliminar acentos de una cadena de texto
  const removeAccents = (str: string) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  // Función para manejar la selección/deselección de un maestro
  const handleTeacherSelect = (selectedTeacherName: string) => {
    setSelectedTeachers((prevSelected) => {
      if (prevSelected.includes(selectedTeacherName)) {
        return prevSelected.filter(
          (teacher) => teacher !== selectedTeacherName
        );
      } else {
        return [...prevSelected, selectedTeacherName];
      }
    });
  };

  // Función para manejar la selección/deselección de una materia para un maestro dado
  const handleSubjectSelect = (teacherName: string, subjectName: string) => {
    setSelectedSubjects((prevSelected) => ({
      ...prevSelected,
      [teacherName]: prevSelected[teacherName]
        ? prevSelected[teacherName].includes(subjectName)
          ? prevSelected[teacherName].filter((name) => name !== subjectName)
          : [...prevSelected[teacherName], subjectName]
        : [subjectName],
    }));
  };

  // Función para exportar los datos de las nóminas a un archivo Excel
  const handleExport = () => {
    const workbook = XLSX.utils.book_new(); // Crea un nuevo libro de trabajo

    // Array para almacenar los datos del encabezado de la hoja de cálculo
    const worksheetData: any[][] = [
      [
        "Nombre del Maestro",
        "Nombre de la Materia",
        "Curso",
        "Inicio",
        "Fin",
        "Carrera",
        "Semestre",
        "Sección",
        "Horas Programadas",
        "Horas Reales",
        "Clasificación",
        "Pago",
        "Honorarios",
      ],
    ];

    // Recorre la base de datos y agrega los datos de las materias seleccionadas a worksheetData
    db.forEach((teacher) => {
      if (selectedTeachers.includes(teacher.name)) {
        const subjectsToExport = selectedSubjects[teacher.name] || [];
        if (subjectsToExport.length > 0) {
          let isFirstSubject = true;
          teacher.materias.forEach((subject) => {
            if (subjectsToExport.includes(subject.name)) {
              if (isFirstSubject) {
                worksheetData.push([teacher.name, subject.name]); // Agrega el nombre del maestro junto con la primera materia
                isFirstSubject = false;
              } else {
                worksheetData.push(["", subject.name]); // Agrega una celda vacía para omitir el nombre del maestro en las siguientes materias
              }
              worksheetData[worksheetData.length - 1] = [
                ...worksheetData[worksheetData.length - 1], // Agrega los datos de la materia restantes
                subject.course || "",
                subject.start,
                subject.end,
                subject.carr,
                subject.sem || "",
                subject.sec || "",
                subject.hours_prog || "",
                subject.hours_real || "",
                subject.clasif || "",
                subject.pago || "",
                subject.honorarios || "",
              ];
            }
          });
        }
      }
    });

    // Convierte worksheetData en una hoja de cálculo
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    // Añade la hoja de cálculo al libro de trabajo
    XLSX.utils.book_append_sheet(workbook, worksheet, "Nóminas");

    // Genera el nombre del archivo Excel basado en los maestros seleccionados
    const fileName = `Nomina_${selectedTeachers
      .join("_")
      .replace(/ /g, "_")}.xlsx`;
    // Descarga el archivo Excel
    XLSX.writeFile(workbook, fileName);
  };

  // Filtra los maestros según el término de búsqueda
  const filteredTeachers = db.filter((teacher) =>
    removeAccents(teacher.name.toLowerCase()).includes(
      removeAccents(searchTerm.toLowerCase())
    )
  );

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Componente de la barra de navegación */}
      <NavbarSidebar>
        <Box p={5}>
          {/* Ajusta el padding horizontal */}
          <Flex justifyContent="space-between" alignItems="center">
            {/* Componente del encabezado de la página */}
            <PageHeader title={"Nóminas"} />
            {/* Botón para exportar a Excel */}
            <Button
              onClick={handleExport}
              py={3}
              bg="green.600"
              color="white"
              fontWeight="semibold"
              rounded="md"
              _hover={{ bg: "green.700" }}
            >
              Exportar a Excel
            </Button>
          </Flex>
          <Box
            mt={6}
            mb={6}
            display="flex"
            justifyContent="space-between"
            gap={2}
          >
            <Box flex={1} gap={2}>
              {/* Campo de búsqueda de maestros */}
              <FormControl position="relative">
                <Input
                  type="text"
                  placeholder="Buscar maestro"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
            </Box>
            <Box>
              <Box display="flex" gap={2}>
                {/* Campos de fecha de inicio y fin */}
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  border="1px"
                  borderColor="gray.300"
                  rounded="md"
                  px={4}
                  py={2}
                  fontSize="sm"
                  focusBorderColor="blue.500"
                />
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  border="1px"
                  borderColor="gray.300"
                  rounded="md"
                  px={4}
                  py={2}
                  fontSize="sm"
                  focusBorderColor="blue.500"
                />
              </Box>
            </Box>
          </Box>

          {/* ----------------- LISTA DE MAESTROS Y MATERIAS ----------------- */}
          <Flex mt={4} h="calc(100vh - 300px)">
            <Box flex={1} pr={4} maxW="30%" h={"100%"}>
              {/* Título del listado de maestros */}
              <Box fontWeight="semibold" fontSize={25} mb={2}>
                Listado de maestros
              </Box>
              <Box
                overflowY="auto"
                h="100%" // Establece una altura fija para el recuadro
                border="1px"
                borderColor="gray.300"
                rounded="md"
                boxShadow="lg" // Agregamos sombra
              >
                <Stack spacing={2} p={2}>
                  {/* Itera sobre los maestros filtrados */}
                  {filteredTeachers.map((teacher, index) => (
                    <Box
                      key={index}
                      borderWidth="1px"
                      rounded="md"
                      p={2}
                      _hover={{ cursor: "pointer", bg: "gray.100" }} // Cambia el color de fondo al pasar el ratón
                      onClick={() => handleTeacherSelect(teacher.name)}
                    >
                      {/* Checkbox para seleccionar/deseleccionar maestro */}
                      <Checkbox
                        isChecked={selectedTeachers.includes(teacher.name)}
                        onChange={() => handleTeacherSelect(teacher.name)}
                        colorScheme="green"
                      >
                        {teacher.name}
                      </Checkbox>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Box>
            <Box flex={1} h={"100%"}>
              {/* Título de la selección de materias */}
              <Box fontWeight="semibold" fontSize={25} mb={2}>
                Selección de materias
              </Box>
              <Box
                overflowY="auto"
                h="100%" // Establece una altura fija para el recuadro
                border="1px"
                borderColor="gray.300"
                rounded="md"
                boxShadow="lg" // Agregamos sombra
              >
                {/* Itera sobre los maestros seleccionados */}
                {selectedTeachers.map((teacher, index) => (
                  <Accordion allowToggle key={index} defaultIndex={[0]}>
                    <AccordionItem
                      key={teacher}
                      borderBottom={"2px"}
                      borderBottomColor={"green.500"}
                    >
                      <h2>
                        <AccordionButton>
                          <Flex
                            alignItems={"center"}
                            as="span"
                            flex="1"
                            textAlign="left"
                            gap={1}
                          >
                            {/* Icono de punto para indicar maestro */}
                            <Box color={"green.500"}>
                              <FaDotCircle />
                            </Box>
                            {/* Nombre del maestro */}
                            <Heading fontSize={"xl"}>{teacher}</Heading>
                          </Flex>
                          {/* Menú para eliminar maestro */}
                          <Menu autoSelect={false}>
                            <MenuButton
                              as={IconButton}
                              aria-label="Options"
                              icon={<FaTrash />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTeacherSelect(teacher);
                              }}
                              colorScheme="red"
                            />
                          </Menu>
                        </AccordionButton>
                      </h2>
                      <AccordionPanel>
                        <Stack spacing={2} p={2}>
                          {/* Itera sobre las materias del maestro */}
                          {db
                            .find((t) => t.name === teacher)
                            ?.materias.map((subject, index) => (
                              <Box
                                key={index}
                                borderWidth="1px"
                                rounded="md"
                                p={2}
                                _hover={{ cursor: "pointer", bg: "gray.100" }} // Cambia el color de fondo al pasar el ratón
                                onClick={() =>
                                  handleSubjectSelect(teacher, subject.name)
                                }
                              >
                                <Flex
                                  justifyContent="space-between"
                                  alignItems="center"
                                >
                                  {/* Checkbox para seleccionar/deseleccionar materia */}
                                  <Checkbox
                                    isChecked={
                                      selectedSubjects[teacher]?.includes(
                                        subject.name
                                      ) ?? false
                                    }
                                    onChange={() =>
                                      handleSubjectSelect(teacher, subject.name)
                                    }
                                    colorScheme="green"
                                    _hover={{ bg: "transparent" }}
                                  >
                                    {subject.name}
                                  </Checkbox>
                                  {/* Información adicional de la materia */}
                                  <Flex alignItems="center">
                                    <Box color="gray.500" fontSize="sm" mr="2">
                                      {subject.start}{" "}
                                      <span style={{ fontWeight: "bold" }}>
                                        Inicio
                                      </span>
                                    </Box>
                                    <Box color="gray.500" fontSize="sm">
                                      {subject.end}{" "}
                                      <span style={{ fontWeight: "bold" }}>
                                        Fin
                                      </span>
                                    </Box>
                                  </Flex>
                                </Flex>
                              </Box>
                            ))}
                        </Stack>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                ))}
              </Box>
            </Box>
          </Flex>
        </Box>
      </NavbarSidebar>
    </div>
  );
};

export default Nominas;
