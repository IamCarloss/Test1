import { IProfessor } from "@/models/interfaces/professorInterface";
import { convertToTitleCase } from "@/utils/titleCase";
import {
  Button,
  Divider,
  MenuItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FaCheck } from "react-icons/fa";

interface ActivateProfessorModalProps {
  teacher: IProfessor;
  setIsLoading: Function;
  refreshTable: Function;
}

export default function ActivateProfessorModal({
  teacher,
  setIsLoading,
  refreshTable,
}: ActivateProfessorModalProps) {
  // -------- HOOKS -------- //
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // -------- FUNCION PARA ACTIVAR MAESTRO -------- //
  const activateProfessor = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/professors", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ professor_id: teacher._id, active: true }),
      });

      if (response.status === 200) {
        toast({
          title: "Docente Activado",
          description: `El docente ${teacher.name} ha sido activado correctamente.`,
          variant: "left-accent",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        refreshTable();
      } else {
        toast({
          title: "Error al Activar Docente",
          description: "Ocurrió un error inesperado.",
          variant: "left-accent",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    setIsLoading(false);
    onClose();
  };

  return (
    <>
      {/* // -------- BOTON PARA ABRIR MODAL -------- // */}
      <MenuItem
        icon={<FaCheck />}
        color={"green.500"}
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
      >
        Desarchivar Docente
      </MenuItem>

      {/* // -------- MODAL -------- // */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          {/* // - MODAL HEADER - // */}
          <ModalHeader fontWeight={"bold"}>Desarchivar Docente</ModalHeader>
          <ModalCloseButton />
          <Divider />

          {/* // - MODAL BODY - // */}
          <ModalBody>
            <p>
              ¿Estás seguro que deseas desarchivar al docente{" "}
              <strong>{convertToTitleCase(teacher.name)}</strong>? Esto hará que
              el docente vuelva a estar disponible en los listados.
            </p>
          </ModalBody>

          {/* // - MODAL FOOTER - // */}
          <Divider />
          <ModalFooter>
            <Button variant={"ghost"} mr={3} onClick={onClose}>
              Cerrar
            </Button>

            <Button colorScheme="green" onClick={activateProfessor}>
              Desarchivar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
