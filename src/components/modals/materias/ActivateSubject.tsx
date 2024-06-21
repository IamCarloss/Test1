import { ISubject } from "@/models/interfaces/subjectInterface";
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

interface ActivateSubjectModalProps {
  subject: ISubject;
  setIsLoading: Function;
  refreshTable: Function;
}

export default function ActivateSubjectModal({
  subject,
  setIsLoading,
  refreshTable,
}: ActivateSubjectModalProps) {
  //--HOOKS--//
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  //--FUNCION PARA ACTIVAR MATERIA--//
  const activateSubject = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/subjects", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject_id: subject._id, active: true }),
      });

      if (response.status === 200) {
        toast({
          title: "Materia Activada",
          description: `La materia ${subject.name} ha sido activada correctamente.`,
          variant: "left-accent",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        refreshTable();
      } else {
        toast({
          title: "Error al Activar Materia",
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
      {/*--BOTON PARA ABRIR MODAL*/}
      <MenuItem
        icon={<FaCheck></FaCheck>}
        color={"green.500"}
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
      >
        Desarchivar materia
      </MenuItem>

      {/*--MODAL--*/}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay></ModalOverlay>
        <ModalContent>
          {/* // - MODAL HEADER - // */}
          <ModalHeader fontWeight={"bold"}>Desarchivar materia</ModalHeader>
          <ModalCloseButton />
          <Divider />

          {/* // - MODAL BODY - // */}
          <ModalBody>
            <p>
              ¿Estás seguro que deseas desarchivar la materia de{" "}
              <strong>{convertToTitleCase(subject.name)}</strong>? Esto hará que
              la materia vuelva a estar disponible en los listados.
            </p>
          </ModalBody>

          {/* // - MODAL FOOTER - // */}
          <Divider />
          <ModalFooter>
            <Button variant={"ghost"} mr={3} onClick={onClose}>
              Cerrar
            </Button>

            <Button colorScheme="green" onClick={activateSubject}>
              Desarchivar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
