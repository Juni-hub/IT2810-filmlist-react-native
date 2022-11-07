import { Button, Center, Modal, Text } from "native-base";

import { CreateShowFilmProps } from "../utils/Interface";
import React from "react";

/** 
* Const for showing a model with more information on a filmitem
* @param film chosen filmitem
* @param open boolean to decide if modal should be open or closed
* @param onCancel function to close the modal
* @return a modal to show information about a filmitem 
*/
export const ShowFilmItem: React.FC<CreateShowFilmProps> = ({
    film,
    open,
    onCancel,
  }) => {
  
    return(
        <Center>
            <Modal isOpen={open} onClose={onCancel}>
            <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>Chosen film</Modal.Header>
            <Modal.Body>
                    <Text marginBottom={2} style={{fontSize: 15}}> {film.title? film.title: ""} </Text>
                    <Text marginBottom={2} style={{fontSize: 15}}>Year: {film.year? film.year: ""} </Text>
                    <Text marginBottom={2} style={{fontSize: 15}}>Cast: {(film.cast.length === 0)? "No cast is registered for this film": film.cast.map((el) => el + ", ")}</Text>
                    <Text marginBottom={2} style={{fontSize: 15}}>Genres: {(film.genres.length === 0)? "No genre is registered for this film" : film.genres.map((el) => el + ", ")}</Text>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline" colorScheme="blueGray" onPress={onCancel}>
                    <Text>Close</Text>
                </Button>
            </Modal.Footer>
            </Modal.Content>
        </Modal>
        </Center>
    );
};