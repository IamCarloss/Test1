import { Box, Flex, Heading } from "@chakra-ui/react";

export interface IPageHeader {
  title: String;
  children?: React.ReactNode;
}

const PageHeader: React.FC<IPageHeader> = ({ title, children }) => {
  return (
    <>
      <Box w="full" gap={3}>
        <Flex
          h="full"
          direction={["column", "row"]}
          justify={"space-between"}
          alignItems={["left", "center"]}
          gap={3}
        >
          <Flex
            py={3}
            px={5}
            bg={"white"}
            rounded={"full"}
            shadow={"md"}
            alignItems={"center"}
            gap={3}
          >
            <Box h={3} w={3} bgColor={"green.500"} rounded={"full"}></Box>
            <Heading fontSize={"xl"}>{title}</Heading>
          </Flex>
          <Flex direction={"row"} justify={"end"}>
            {children}
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default PageHeader;
