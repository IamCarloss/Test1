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
import { FaArchive } from "react-icons/fa";

interface ArchiveSubjectModalProps {
  subject: ISubject;
  setIsLoading: Function;
  refreshTable: Function;
}

export default function ArchiveSubjectModal({
  subject,
  setIsLoading,
  refreshTable,
}: ArchiveSubjectModalProps) {
  //--HOOKS--//
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  //--ARCHIVAR MATERIA--//
  const handleArchive = async () => {
    setIsLoading(true);

    try {
      const res = await fetch("api/subjects", {
        method: "DELETE",
        body: JSON.stringify({ subject_id: subject._id }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 200) {
        toast({
          title: "Materia Archivada",
          description: `La materia ${subject.name} ha sido archivada.`,
          variant: "left-accent",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        refreshTable();
        onClose();
      } else {
        toast({
          title: "Error al archivar materia",
          description: "Ha ocurrido un error al archivar la materia.",
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
  };

  return (
    <>
      {/*--BOTON PARA ABRIR MODAL--*/}
      <MenuItem
        icon={<FaArchive />}
        color={"red.500"}
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
      >
        Archivar materia
      </MenuItem>

      {/*--MODAL--*/}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay></ModalOverlay>
        <ModalContent>
          {/*--MODAL HEADER--*/}
          <ModalHeader>Archivar materia</ModalHeader>
          <ModalCloseButton></ModalCloseButton>
          <Divider></Divider>

          {/*--MODAL BODY--*/}
          <ModalBody>
            ¿Estás seguro que deseas archivar la materia de{""}{" "}
            <strong>{convertToTitleCase(subject.name)}</strong>? Esto hará que
            el docente no pueda ser seleccionado en los listados hasta que sea
            desarchivado.
          </ModalBody>

          {/*--MODAL FOOTER--*/}
          <Divider></Divider>
          <ModalFooter>
            <Button variant={"ghost"} mr={3} onClick={onClose}>
              Cerrar
            </Button>
            <Button colorScheme="red" onClick={handleArchive}>
              Archivar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
