import { IClasificacion } from "@/models/interfaces/clasificacionInterface";
import {
  Button,
  Divider,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { MdDeleteOutline } from "react-icons/md";

interface ModalProps {
  clasificacionData: IClasificacion | null;
  isLoading: boolean;
  refresh: Function;
}
export const ModalDelete: React.FC<ModalProps> = ({
  clasificacionData,
  refresh,
  isLoading,
}) => {
  const toast = useToast();

  const OverlayOne = () => <ModalOverlay backdropFilter="blur(2px)" />;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = React.useState(<OverlayOne />);

  const BorrarPagoHora = async () => {
    const precargado = clasificacionData;

    if (precargado) {
      const nuevoPrecargado = {
        ...precargado,
        primaria: "0",
        secundaria: "0",
        bachillerato: "0",
        universidad: "0",
        posgrado: "0",
        nocturna: "0",
        virtual: "0",
        taller: "0",
      };

      try {
        const res = await fetch("/api/gestion-salarial/", {
          method: "PUT",
          body: JSON.stringify({
            datos: nuevoPrecargado,
            _id: clasificacionData._id,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.status != 200) {
          console.error("Error al enviar la solicitud:", res.statusText);
          toast({
            title: "La clasificacion no fue restablecida.",
            description:
              "La clasificacion no ha sido restablecida correctamente.",
            status: "error",
            duration: 2000,
            isClosable: true,
            position: "top",
          });
          return;
        }

        refresh();
        toast({
          title: "Clasificacion restablecida.",
          description: "La clasificacion ha sido restablecida correctamente.",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
      } catch (error) {
        toast({
          title: "Error.",
          description: `Error al enviar la solicitud:, ${error}`,
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
      }
    }
  };

  return (
    <>
      {/* ////////  ICONO DE BORRAR  ////////// */}
      <IconButton
        isLoading={isLoading}
        borderRadius={0}
        h={"100%"}
        w={"100%"}
        variant={"ghost"}
        aria-label="Search database"
        colorScheme="red"
        icon={<MdDeleteOutline size={38} fontWeight="bold" />}
        onClick={() => {
          setOverlay(<OverlayOne />);
          onOpen();
        }}
      />

      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        {overlay}
        <ModalContent>
          <ModalHeader color="red.500" fontWeight={"bold"}>
            Restablecer Clasificacion:{" "}
            {clasificacionData?.clasificacion.toLocaleUpperCase()}
          </ModalHeader>
          <ModalCloseButton />
          <Divider />
          <ModalBody>
            <Text>
              ¿Estás seguro de que quieres Restablecer la clasificación?
            </Text>
          </ModalBody>
          <Divider />
          <ModalFooter>
            <Button mr={5} onClick={onClose}>
              Cancelar
            </Button>
            {/* ////////  BOTON DE BORRAR  ////////// */}
            <Button
              colorScheme="red"
              fontSize={"md"}
              size="md"
              fontWeight="bold"
              onClick={() => {
                BorrarPagoHora();
                onClose();
              }}
            >
              Restablecer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
