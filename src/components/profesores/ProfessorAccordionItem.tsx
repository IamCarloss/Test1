import { IProfessor } from "@/models/interfaces/professorInterface";
import { convertToTitleCase } from "@/utils/titleCase";
import {
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
  MenuList,
} from "@chakra-ui/react";
import { FaDotCircle } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import ActivateProfessorModal from "../modals/professors/ActivateProfessorModal";
import ArchiveProfessorModal from "../modals/professors/ArchiveProfessorModal";
import EditProfessorModal from "../modals/professors/EditProfessorModal";

interface ProfessorAccordionItemProps {
  professor: IProfessor;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  getProfessors: Function;
}

export default function ProfessorAccordionItem({
  professor,
  setIsLoading,
  getProfessors,
}: ProfessorAccordionItemProps) {
  // -------- COLORES DE CLASIFICACION -------- //
  const classificationColors = {
    a: "green",
    b: "yellow",
    c: "orange",
    d: "blue",
    i: "gray",
  };

  return (
    <AccordionItem
      key={professor.name}
      borderBottom={"2px"}
      borderBottomColor={"green.500"}
    >
      {/* // -------- BOTON DE MAESTRO -------- // */}
      <AccordionButton>
        <Flex alignItems={"center"} as="span" flex="1" textAlign="left" gap={2}>
          <Box color={"green.500"}>
            <FaDotCircle />
          </Box>

          {/* // -------- NOMBRE DEL MAESTRO -------- // */}
          <Heading fontSize={"xl"}>
            {convertToTitleCase(professor.name)}
          </Heading>

          {/* // -------- RFC DEL MAESTRO -------- // */}
          {professor.rfc && (
            <>
              <Box
                className="vertical-separator-char"
                as="span"
                fontSize={"lg"}
              >
                |
              </Box>
              <span
                style={{
                  color: "gray",
                  fontSize: "sm",
                  fontWeight: "bold",
                }}
              >
                {professor.rfc}
              </span>
            </>
          )}

          {/* // -------- CLASIFICACION DEL MAESTRO -------- // */}
          <Badge
            ms={2}
            py={1}
            variant={"solid"}
            px={2}
            colorScheme={classificationColors[professor.classification]}
          >
            {professor.classification}
          </Badge>
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
            {/* // -------- EDITAR MAESTRO -------- // */}
            <EditProfessorModal
              professor={professor}
              setIsLoading={setIsLoading}
              refreshTable={getProfessors}
            />

            <MenuDivider />

            {/* // -------- ARCHIVAR MAESTRO -------- // */}
            {professor.active && (
              <ArchiveProfessorModal
                teacher={professor}
                setIsLoading={setIsLoading}
                refreshTable={getProfessors}
              />
            )}

            {!professor.active && (
              <ActivateProfessorModal
                teacher={professor}
                setIsLoading={setIsLoading}
                refreshTable={getProfessors}
              />
            )}
          </MenuList>
        </Menu>
      </AccordionButton>

      <AccordionPanel py={0} px={6}></AccordionPanel>
    </AccordionItem>
  );
}
