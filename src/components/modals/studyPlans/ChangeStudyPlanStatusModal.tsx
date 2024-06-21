import { academicLevelConverter } from "@/utils/academicLevelConverter";
import { convertToTitleCase } from "@/utils/titleCase";
import {
  Box,
  Button,
  Divider,
  ListItem,
  MenuItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  UnorderedList,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FaArchive, FaCheck } from "react-icons/fa";

interface IChangeStudyPlanStatusModalProps {
  career: ICareer;
  studyPlan: IStudyPlan;
  getStudyPlans: Function;
  setIsLoading: Function;
  action: "archive" | "restore";
}

export default function ChangeStudyPlanStatusModal({
  career,
  studyPlan,
  getStudyPlans,
  setIsLoading,
  action,
}: IChangeStudyPlanStatusModalProps) {
  // -------- HOOKS -------- //
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // -------- VARIABLES -------- //
  const color = action == "archive" ? "red.500" : "green.500";

  // -------- FUNCION PARA ARCHIVAR PLAN DE ESTUDIO -------- //
  const archiveStudyPlan = async () => {
    setIsLoading(true);

    try {
      const res = await fetch(`/api/studyPlans/${studyPlan._id}`, {
        method: "DELETE",
      });

      if (res.status == 200) {
        toast({
          title: "Plan de Estudio Archivado",
          description: "El plan de estudio ha sido archivado correctamente",
          variant: "left-accent",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        getStudyPlans();
        onClose();
      } else {
        toast({
          title: "Error al Archivar",
          description: "Ha ocurrido un error al archivar el plan de estudio",
          variant: "left-accent",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error al Archivar",
        description: "Ha ocurrido un error al archivar el plan de estudio",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    setIsLoading(false);
  };

  // -------- FUNCION PARA RESTAURAR PLAN DE ESTUDIO -------- //
  const restoreStudyPlan = async () => {
    setIsLoading(true);

    try {
      const res = await fetch(`/api/studyPlans/${studyPlan._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ active: true }),
      });

      if (res.status == 200) {
        toast({
          title: "Plan de Estudio Restaurado",
          description: "El plan de estudio ha sido restaurado correctamente",
          variant: "left-accent",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        getStudyPlans();
        onClose();
      } else {
        toast({
          title: "Error al Restaurar",
          description: "Ha ocurrido un error al restaurar el plan de estudio",
          variant: "left-accent",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error al Restaurar",
        description: "Ha ocurrido un error al restaurar el plan de estudio",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    setIsLoading(false);
  };

  return (
    <>
      {/* // -------- BOTON PARA ABRIR MODAL -------- // */}
      {action == "archive" ? (
        <MenuItem
          color={"red.500"}
          fontWeight={"bold"}
          icon={<FaArchive />}
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
        >
          Archivar Plan de Estudio
        </MenuItem>
      ) : (
        <MenuItem
          color={"green.500"}
          fontWeight={"bold"}
          icon={<FaCheck />}
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
        >
          Desarchivar Plan de Estudio
        </MenuItem>
      )}

      {/* // -------- MODAL -------- // */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          {/* // - MODAL HEADER - // */}
          <ModalHeader fontWeight={"bold"} color={color}>
            {action == "archive"
              ? "Archivar Plan de Estudio"
              : "Desarchivar Plan de Estudio"}
          </ModalHeader>
          <ModalCloseButton />
          <Divider />

          {/* // - MODAL BODY - // */}
          <ModalBody py={4}>
            <Text>
              ¿Está seguro que desea archivar el plan de estudio{" "}
              <Box as="strong" color={color}>
                {convertToTitleCase(studyPlan.name)}
              </Box>
              ? Esto hara que el plan de estudio no sea visible para los
              listados.
            </Text>

            <Box mt={2}>
              Informacion de la carrera asociada al plan de estudio:
            </Box>

            <UnorderedList mt={2}>
              <ListItem fontWeight={"bold"}>
                {convertToTitleCase(career.name)}
              </ListItem>

              <ListItem fontWeight={"bold"}>
                <Box as="em" color={"green.600"}>
                  {academicLevelConverter(career.academicLevel)}
                </Box>
              </ListItem>
            </UnorderedList>
          </ModalBody>

          {/* // - MODAL FOOTER - // */}
          <Divider />
          <ModalFooter>
            <Button variant={"ghost"} mr={3} onClick={onClose}>
              Cerrar
            </Button>

            {/* // -------- BOTON PARA ARCHIVAR PLAN DE ESTUDIO -------- // */}
            {action == "archive" ? (
              <Button colorScheme="red" onClick={archiveStudyPlan}>
                Archivar
              </Button>
            ) : (
              <Button colorScheme="green" onClick={restoreStudyPlan}>
                Desarchivar
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
