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
import { FaArchive, FaCheck } from "react-icons/fa";

interface ChangeCareerStatusModalProps {
  career: ICareer;
  action: "archive" | "restore";
  refreshTable: Function;
  setIsLoading: Function;
}

export default function ChangeCareerStatusModal({
  career,
  action,
  refreshTable,
  setIsLoading,
}: ChangeCareerStatusModalProps) {
  // -------- HOOKS -------- //
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // -------- HANDLE ARCHIVE CAREER -------- //
  const handleArchiveCareer = async () => {
    setIsLoading(true);
    try {
      // ------ PETICION A LA API ------ //
      const response = await fetch(`/api/careers`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: career._id }),
      });

      // ------ RESPUESTA DE LA API ------ //
      const data = await response.json();

      // ------ VALIDACION DE RESPUESTA ------ //
      if (response.status != 200) {
        toast({
          title: "Error al archivar carrera!",
          description: "Ocurrio un error al archivar la carrera.",
          variant: "left-accent",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }

      // ------ MENSAJE DE EXITO ------ //
      toast({
        title: "Carrera Archivada",
        description: "La carrera ha sido archivada exitosamente.",
        variant: "left-accent",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // ------ CERRAR MODAL ------ //
      refreshTable();
      onClose();
    } catch (error) {
      // ------ MENSAJE DE ERROR ------ //
      toast({
        title: "Error",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  };

  // -------- HANDLE RESTORE CAREER -------- //
  const handleRestoreCareer = async () => {
    try {
      // ------ PETICION A LA API ------ //
      const response = await fetch(`/api/careers`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: career._id, active: true }),
      });

      // ------ VALIDACION DE RESPUESTA ------ //
      if (response.status != 200) {
        toast({
          title: "Error al desarchivar carrera!",
          description: "Ocurrio un error al desarchivar la carrera.",
          variant: "left-accent",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }

      // ------ MENSAJE DE EXITO ------ //
      toast({
        title: "Carrera Desarchivada",
        description: "La carrera ha sido desarchivada exitosamente.",
        variant: "left-accent",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // ------ CERRAR MODAL ------ //
      refreshTable();
      onClose();
    } catch (error) {
      // ------ MENSAJE DE ERROR ------ //
      toast({
        title: "Error",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      {/* // -------- BOTON PARA ABRIR MODAL -------- // */}
      {action == "archive" ? (
        <MenuItem
          icon={<FaArchive />}
          color={"red.500"}
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
        >
          Archivar Carrera
        </MenuItem>
      ) : (
        <MenuItem
          icon={<FaCheck />}
          color={"green.500"}
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
        >
          Desarchivar Carrera
        </MenuItem>
      )}

      {/* // -------- MODAL -------- // */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          {/* // - MODAL HEADER - // */}
          <ModalHeader
            fontWeight={"bold"}
            color={action == "archive" ? "red.500" : "green.500"}
          >
            {action == "archive" ? "Archivar" : "Desarchivar"} Carrera
          </ModalHeader>
          <ModalCloseButton />
          <Divider />

          {/* // - MODAL BODY - // */}
          <ModalBody>
            {action == "archive" ? (
              <p>
                ¿Estás seguro que deseas archivar esta carrera? Esto hara que la
                carrera no sea visible en los listados.
              </p>
            ) : (
              <p>
                ¿Estás seguro que deseas desarchivar esta carrera? Esto hara que
                la carrera sea visible en los listados.
              </p>
            )}
          </ModalBody>

          {/* // - MODAL FOOTER - // */}
          <Divider />
          <ModalFooter>
            <Button variant={"ghost"} mr={3} onClick={onClose}>
              Cerrar
            </Button>

            <Button
              colorScheme={action == "archive" ? "red" : "green"}
              onClick={
                action == "archive" ? handleArchiveCareer : handleRestoreCareer
              }
            >
              {action == "archive" ? "Archivar" : "Desarchivar"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
