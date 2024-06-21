import {
  Box,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect } from "react";

export interface ILoaderModal {
  isLoading: boolean;
}

const LoaderModal: React.FC<ILoaderModal> = ({ isLoading }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (isLoading == true) {
      onOpen();
    } else {
      onClose();
    }
  }, [isLoading]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        closeOnEsc={false}
        closeOnOverlayClick={false}
        size={"xs"}
        isCentered
      >
        <ModalOverlay />

        <ModalContent>
          <ModalBody py={"5rem"}>
            <Box w={"100%"} display={"flex"} justifyContent={"center"}>
              <Spinner
                color="green.500"
                size={"xl"}
                thickness={"3px"}
                emptyColor={"gray.200"}
              />
            </Box>

            <Box
              fontWeight={"bold"}
              fontSize={"1.2rem"}
              mt={5}
              w={"100%"}
              textAlign={"center"}
            >
              Cargando, por favor no recargue la pagina...
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LoaderModal;
