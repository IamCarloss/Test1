import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  Input,
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
import { FaChalkboardTeacher } from "react-icons/fa";

interface AddProfessorModalProps {
  setIsLoading: Function;
  refreshTable: Function;
}

export default function AddProfessorModal({
  setIsLoading,
  refreshTable,
}: AddProfessorModalProps) {
  // -------- HOOKS -------- //
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // -------- USESTATE -------- //
  const [name, setName] = useState<string>("");
  const [rfc, setRfc] = useState<string>("");
  const [classification, setClassification] = useState<string>("");

  // -------- AGREGAR MAESTRO -------- //
  const addProfessor = async () => {
    // ------- VALIDACIONES ------- //
    // Validar que el campo de nombre no este vacio
    if (name.trim() == "") {
      toast({
        title: "Error al registrar docente.",
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
        title: "Error al registrar docente.",
        description: "El campo de nombre no puede tener mas de 50 caracteres.",
        variant: "left-accent",
        status: "error",
        duration: 3000,
        isClosable: true,
      });

      return;
    }

    // Validar que el campo de RFC no tenga mas de 13 caracteres
    if (rfc.length > 13) {
      toast({
        title: "Error al registrar docente.",
        description: "El campo de RFC no puede tener mas de 13 caracteres.",
        variant: "left-accent",
        status: "error",
        duration: 3000,
        isClosable: true,
      });

      return;
    }

    // Validar que la clasificación no este vacia
    if (classification == "") {
      toast({
        title: "Error al registrar docente.",
        description: "Seleccione una clasificación para el maestro.",
        variant: "left-accent",
        status: "error",
        duration: 3000,
        isClosable: true,
      });

      return;
    }

    // ------- AGREGAR A DB ------- //
    setIsLoading(true);
    try {
      // - Fetch POST - //
      const res = await fetch("/api/professors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, rfc: rfc.trim(), classification }),
      });

      if (res.status === 200) {
        // - Mensaje de exito - //
        toast({
          title: "Docente agregado.",
          description: `El docente ${name} ha sido agregado exitosamente.`,
          variant: "left-accent",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        setName("");
        setRfc("");
        setClassification("");
        refreshTable();
      } else if (res.status == 400) {
        // - Mensaje de error - //
        const data = await res.json();
        toast({
          title: "Error al registrar docente.",
          description: data.message,
          variant: "left-accent",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        // - Mensaje de error - //
        toast({
          title: "Error al registrar docente.",
          description: "Ha ocurrido un error al agregar el maestro.",
          variant: "left-accent",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      // - Mensaje de error - //
      toast({
        title: "Error.",
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
      <Button colorScheme="green" gap={3} onClick={onOpen} variant={"outline"}>
        <FaChalkboardTeacher />
        Registrar Docente
      </Button>

      {/* // -------- MODAL -------- // */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          {/* // - MODAL HEADER - // */}
          <ModalHeader fontWeight={"bold"}>Registrar Docente</ModalHeader>
          <ModalCloseButton />
          <Divider />

          {/* // - MODAL BODY - // */}
          <ModalBody>
            {/* // - NOMBRE COMPLETO - // */}
            <FormControl isRequired>
              <FormLabel>Nombre Completo:</FormLabel>

              <Input
                placeholder="Nombre Completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>

            {/* // - RFC - // */}
            <FormControl mt={4}>
              <FormLabel>RFC:</FormLabel>

              <Input
                placeholder="RFC"
                value={rfc}
                onChange={(e) => setRfc(e.target.value)}
              />
            </FormControl>

            {/* // - CLASIFICACION - // */}
            <FormControl mt={4} isRequired>
              <FormLabel>Clasificación:</FormLabel>

              <Select
                value={classification}
                onChange={(e) => setClassification(e.target.value)}
              >
                <option value="">Seleccione una clasificación...</option>
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

            <Button colorScheme="green" onClick={addProfessor}>
              Agregar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
