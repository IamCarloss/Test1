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
import { FaArchive } from "react-icons/fa";

interface ArchiveProfessorModalProps {
  teacher: IProfessor;
  setIsLoading: Function;
  refreshTable: Function;
}

export default function ArchiveProfessorModal({
  teacher,
  setIsLoading,
  refreshTable,
}: ArchiveProfessorModalProps) {
  // -------- HOOKS -------- //
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // -------- ARCHIVAR MAESTRO -------- //
  const handleArchive = async () => {
    setIsLoading(true);

    try {
      const res = await fetch(`/api/professors`, {
        method: "DELETE",
        body: JSON.stringify({ teacher_id: teacher._id }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 200) {
        toast({
          title: "Docente Archivado",
          description: `El docente ${teacher.name} ha sido archivado.`,
          variant: "left-accent",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        refreshTable();
        onClose();
      } else {
        toast({
          title: "Error al archivar docente",
          description: "Ha ocurrido un error al archivar el docente.",
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
      {/* // -------- BOTON PARA ABRIR MODAL -------- // */}
      <MenuItem
        icon={<FaArchive />}
        color={"red.500"}
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
      >
        Archivar Docente
      </MenuItem>

      {/* // -------- MODAL -------- // */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          {/* // - MODAL HEADER - // */}
          <ModalHeader fontWeight={"bold"} color={"red.500"}>
            Archivar Docente
          </ModalHeader>
          <ModalCloseButton />
          <Divider />

          {/* // - MODAL BODY - // */}
          <ModalBody>
            ¿Estás seguro que deseas archivar a{" "}
            <strong>{convertToTitleCase(teacher.name)}</strong>? Esto hará que
            el docente no pueda ser seleccionado en los listados hasta que sea
            desarchivado.
          </ModalBody>

          {/* // - MODAL FOOTER - // */}
          <Divider />
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
