import { IStudyPlan } from "@/models/interfaces/studyPlanInterface";
import { academicLevelConverter } from "@/utils/academicLevelConverter";
import { convertToTitleCase } from "@/utils/titleCase";
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Flex,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import LoaderSpinner from "../loaders/loaderSpinner";
import ChangeCareerStatusModal from "../modals/careers/ChangeCareerStatusModal";
import EditCareerModal from "../modals/careers/EditCareerModal";
import AddStudyPlanModal from "../modals/studyPlans/AddStudyPlanModal";
import StudyPlanAccordionItem from "../studyPlans/StudyPlanAccordionItem";

interface CareerAccordionItemProps {
  career: ICareer;
  active: boolean;
  getCareers: Function;
  setIsLoading: Function;
}

export default function CareerAccordionItem({
  career,
  active,
  getCareers,
  setIsLoading,
}: CareerAccordionItemProps) {
  // -------- USESTATE -------- //
  const [studyPlans, setStudyPlans] = useState<IStudyPlan[]>([]);
  const [isLoadingStudyPlans, setIsLoadingStudyPlans] = useState<boolean>(true);
  const [visibleArchived, setVisibleArchived] = useState<boolean>(false);

  // -------- OBTENER PLANES DE ESTUDIO -------- //
  const getStudyPlans = async () => {
    setIsLoadingStudyPlans(true);

    try {
      const res = await fetch(
        `/api/studyPlans?careerId=${career._id}&active=${
          visibleArchived == true ? null : "true"
        }&populate_subjects=true`
      );
      const { studyPlans } = await res.json();
      setStudyPlans(studyPlans);
    } catch (error) {
      console.error(error);
    }

    setIsLoadingStudyPlans(false);
  };

  // -------- INITIAL RENDER -------- //
  useEffect(() => {
    getStudyPlans();
  }, [visibleArchived]);

  return (
    <AccordionItem
      key={career._id}
      borderBottom={"2px"}
      borderBottomColor={"green.500"}
    >
      {/* // -------- BOTON DE CARRERA -------- // */}
      <AccordionButton>
        <Flex alignItems={"center"} as="span" flex="1" textAlign="left" gap={2}>
          {/* // -------- NOMBRE DE LA CARRERA -------- // */}
          <Heading fontSize={"2xl"} color={"green.600"}>
            {convertToTitleCase(career.name)}
          </Heading>

          {/* // -------- CODIGO DE LA CARRERA -------- // */}
          <Box className="vertical-separator-char" as="span" fontSize={"lg"}>
            |
          </Box>
          <Box as="span" fontSize={"sm"} color={"gray.400"} fontWeight={"bold"}>
            <em>{career.careerCode}</em>
          </Box>

          {/* // -------- NIVEL ACADEMICO DE LA CARRERA -------- // */}
          <Badge
            ms={2}
            colorScheme={active ? "green" : "red"}
            variant={"solid"}
          >
            {academicLevelConverter(career.academicLevel)}
          </Badge>

          {!isLoadingStudyPlans && studyPlans.length == 0 && (
            <Badge colorScheme="yellow" variant={"solid"}>
              Sin planes de estudio
            </Badge>
          )}
        </Flex>

        {/* // -------- BOTON DE OPCIONES -------- // */}
        <Menu autoSelect={false}>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<IoSettings />}
            onClick={(e) => {
              e.stopPropagation();
            }}
            colorScheme="green"
          />

          {/* // -------- LISTA DE OPCIONES -------- // */}
          <MenuList>
            {/* // -------- OPCION DE CREAR PLAN DE ESTUDIOS -------- // */}
            <AddStudyPlanModal
              career={career}
              setIsLoading={setIsLoading}
              getStudyPlans={getStudyPlans}
            />

            {/* // -------- OPCION DE MOSTRAR/OCULTAR PLANES DE ESTUDIO ARCHIVADOS -------- // */}
            {visibleArchived ? (
              <MenuItem
                icon={<FaEyeSlash />}
                onClick={(e) => {
                  e.stopPropagation();
                  setVisibleArchived(false);
                }}
              >
                Ocultar Planes de Estudio Archivados
              </MenuItem>
            ) : (
              <MenuItem
                icon={<FaEye />}
                onClick={(e) => {
                  e.stopPropagation();
                  setVisibleArchived(true);
                }}
              >
                Mostrar Planes de Estudio Archivados
              </MenuItem>
            )}

            {/* // -------- OPCION DE EDITAR CARRERA -------- // */}
            <EditCareerModal
              career={career}
              refreshTable={getCareers}
              setIsLoading={setIsLoading}
            />

            <MenuDivider borderColor={"green.100"} />

            {/* // -------- OPCION DE ARCHIVAR CARRERA -------- // */}
            {career.active ? (
              <ChangeCareerStatusModal
                career={career}
                action="archive"
                refreshTable={getCareers}
                setIsLoading={setIsLoading}
              />
            ) : (
              <ChangeCareerStatusModal
                career={career}
                action="restore"
                refreshTable={getCareers}
                setIsLoading={setIsLoading}
              />
            )}
          </MenuList>
        </Menu>
      </AccordionButton>

      {/* // -------- CONTENIDO DEL ACORDEON -------- // */}
      <AccordionPanel py={0} px={6}>
        {/* // -------- LOADER DE PLANES DE ESTUDIO -------- // */}
        {isLoadingStudyPlans && <LoaderSpinner paddingY="3rem" />}

        {/* // -------- MENSAJE DE NO HAY PLANES DE ESTUDIO -------- // */}
        {!isLoadingStudyPlans && studyPlans.length == 0 && (
          <Box textAlign="center" pt={6} pb={10} color={"gray.400"}>
            No hay planes de estudio registrados...
          </Box>
        )}

        <Box>
          {/* // -------- LISTA DE PLANES DE ESTUDIO -------- // */}
          {!isLoadingStudyPlans && studyPlans.length > 0 && (
            <Accordion allowMultiple>
              {studyPlans.map((studyPlan: IStudyPlan) => (
                <StudyPlanAccordionItem
                  career={career}
                  studyPlan={studyPlan}
                  getStudyPlans={getStudyPlans}
                  setIsLoading={setIsLoading}
                />
              ))}
            </Accordion>
          )}
        </Box>
      </AccordionPanel>
    </AccordionItem>
  );
}
