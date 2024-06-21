import { IProfessor } from "@/models/interfaces/professorInterface";
import { convertToTitleCase } from "@/utils/titleCase";
import {
  Button,
  Divider,
  FormControl,
  FormLabel,
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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";

interface EditProfessorModalProps {
  professor: IProfessor;
  setIsLoading: Function;
  refreshTable: Function;
}

export default function EditProfessorModal({
  professor,
  setIsLoading,
  refreshTable,
}: EditProfessorModalProps) {
  // -------- HOOKS -------- //
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // -------- USESTATE -------- //
  const [name, setName] = useState<string>(convertToTitleCase(professor.name));
  const [rfc, setRfc] = useState<string>(professor.rfc || "");
  const [classification, setClassification] = useState<string>(
    professor.classification
  );

  // -------- EDITAR Docente -------- //
  const handleEditProfessor = async () => {
    // ------- VALIDACIONES ------- //
    // Validar que el campo de nombre no este vacio
    if (name.trim() == "") {
      toast({
        title: "Error al editar docente.",
        description: "El campo de nombre no puede estar vacio.",
        variant: "left-accent",
        status: "error",
        duration: 3000,
        isClosable: true,
      });

      return;
    }

    // Validar que el campo de nombre no tenga mas de 50 caracteres
    if (name.length > 50) {
      toast({
        title: "Error al editar docente.",
        description: "El campo de nombre no puede tener mas de 50 caracteres.",
        variant: "left-accent",
        status: "error",
        duration: 3000,
        isClosable: true,
      });

      return;
    }

    // ------- PETICION PUT ------- //
    setIsLoading(true);
    try {
      const res = await fetch("/api/professors", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          professor_id: professor._id,
          name,
          rfc: rfc.trim(),
          classification,
        }),
      });

      // ------- VALIDAR RESPUESTA ------- //
      if (res.status === 200) {
        // ------ MENSAJE DE EXITO ------ //
        toast({
          title: "Docente editado",
          description: "El docente ha sido editado exitosamente.",
          variant: "left-accent",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        refreshTable();
        onClose();
      } else {
        // ------ MENSAJE DE ERROR ------ //
        toast({
          title: "Error al editar docente.",
          description: "Ocurrio un error al editar el docente.",
          variant: "left-accent",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      // ------ MENSAJE DE ERROR (SISTEMA) ------ //
      toast({
        title: "Error",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }

    setIsLoading(false);
  };

  return (
    <>
      {/* // -------- BOTON PARA ABRIR MODAL -------- // */}
      <MenuItem
        icon={<FaEdit />}
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
      >
        Editar Docente
      </MenuItem>

      {/* // -------- MODAL -------- // */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          {/* // - MODAL HEADER - // */}
          <ModalHeader fontWeight={"bold"}>Editar Docente</ModalHeader>
          <ModalCloseButton />
          <Divider />

          {/* // - MODAL BODY - // */}
          <ModalBody>
            {/* // -------- NOMBRE COMPLETO -------- // */}
            <FormControl isRequired>
              <FormLabel>Nombre Completo:</FormLabel>

              <Input
                placeholder="Nombre Completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>

            {/* // -------- RFC -------- // */}
            <FormControl mt={4}>
              <FormLabel>RFC:</FormLabel>
              <Input
                placeholder="RFC"
                value={rfc}
                onChange={(e) => setRfc(e.target.value)}
              />
            </FormControl>

            {/* // -------- CLASIFICACION -------- // */}
            <FormControl mt={4}>
              <FormLabel>Clasificación:</FormLabel>

              <Select
                isRequired
                value={classification}
                onChange={(e) => setClassification(e.target.value)}
              >
                <option value="a">A</option>
                <option value="b">B</option>
                <option value="c">C</option>
                <option value="d">D</option>
                <option value="i">I</option>
              </Select>
            </FormControl>
          </ModalBody>

          {/* // - MODAL FOOTER - // */}
          <Divider />
          <ModalFooter>
            <Button variant={"ghost"} mr={3} onClick={onClose}>
              Cerrar
            </Button>

            <Button colorScheme="green" onClick={handleEditProfessor}>
              Guardar Cambios
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
