import { ADD_FILM, SEARCH_FILMS } from '../queries/filmQueries';
import { Box, Button, CheckIcon, Divider, HStack, Heading, Input, Row, Select, Spinner, Text, VStack } from 'native-base';
import { setGenre, setSorting, setTitle, setYear } from '../redux/actions';
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery } from '@apollo/client'

import { CreateForm } from './AddFilm';
import { Film } from '../utils/Interface';
import { Pressable } from "react-native";
import React from "react";
import { ShowFilmItem } from './FilmItem';
import {Store} from "../redux/store";
import {YearPicker} from './YearPicker';
import {optionList} from '../helpers/helpers'
import { useState } from 'react';

const PAGE_SIZE = 15;

/** 
* Main component to show list of filmitems on React application
*/
export default function FilmList() {
    const [page, setPage] = useState(0);
    const [openCreate, setOpenCreate] = useState(false);
    const [currentPost, setCurrentPost] = useState<Film>({
        _id: "",
        title: "",
        year: "",
        cast: [""],
        genres: [""]
    });
    const [showFilm, setShowFilm] = useState(false);
    const [filterYear, setFilterYear] = useState(false);

    const hideFilm = () => {
      setShowFilm(false);
    };

    const dispatch = useDispatch();
    const [createPost] = useMutation(ADD_FILM);

    let title = useSelector ((state: Store) => state.title); //fetching title filter from redux store
    let genre = useSelector ((state: Store) => state.genre); //fetching genre filter from redux store
    let year = useSelector ((state: Store) => state.year); //fetching year filter from redux store
    let sorting = useSelector ((state: Store) => state.sorting); //fetching sorting filter from redux store
    
    /** 
    * Retrieves data, loading and error from graphql server
    * @param variables to be considered when retreiving data
    * @return data from graphql server 
    */
    const { loading, error, data } = useQuery(SEARCH_FILMS, {
        variables: {
            limit: PAGE_SIZE,
            offset: page * PAGE_SIZE,
            titleFilter: title,
            genreFilter: genre,
            yearFilter: parseInt(year, 10),
            sorting: parseInt(sorting, 10),
        },
    });

    if (loading) {
        return (
            <HStack space={2} justifyContent="center">
                <Spinner accessibilityLabel="Loading posts" />
                    <Heading color="primary.500" fontSize="md">
                        Loading
                    </Heading>
            </HStack>
        )
    }

   if (error) {
        console.log(error)
        return (
            <h5 style={{color: "#ffffff"}}>Something went wrong when trying to connect to the server...</h5>
        )
    }

    /** 
    * Creates a filmitem in the database
    * @param film to be created
    */
    const onCreate = (film: any) => { 
        createPost({
            variables: {
                title: film.title,
                year: film.year? parseInt(film.year, 10) : 0,
                cast: film.cast? film.cast.split(",") : [],
                genres: film.genres? [film.genres]: [],
            }
        });
        dispatch(setTitle(film.title))
        setOpenCreate(false);
    };

    function handleClick(post: Film) {
        setCurrentPost(post);
        setShowFilm(true);
    }

    let body: any = [];
    body.push (
        data.getFilteredPosts?.map((post: Film) => (
            <Box borderRadius="md">
                <Pressable onPress={() => handleClick(post)}>
            <VStack space="4" divider={<Divider />}>
                <Box px="4">
                    <Heading>
                    <Text>{post.title}</Text>
                    </Heading>
                    <Text>Year Released: {post.year? post.year: ""}</Text>
                </Box>
            </VStack>
            </Pressable>
            </Box>
        ))
    )

    /** 
    * Resets the filters in redux
    */
    function useReset() {
        dispatch(setTitle(""))
        dispatch(setGenre(""))
        dispatch(setYear("0"))
        dispatch(setSorting("1"))

        title = "";
        genre = "";
        year = "0";
        sorting = "1";
    }
    
    return (
        <>
        {!loading && !error && 
            <Box justifyContent="center">    
                <Box  justifyContent="center">
                    <Box >
                        <Input 
                            value={title? title: ""} 
                            placeholder="Search for title" 
                            onChangeText={e => dispatch(setTitle(e))}
                           
                        />
                    </Box>
                    <Box>
                    <Select selectedValue={genre} mx={{base: 0, md: "Genre"
                        }} onValueChange={e => dispatch(setGenre(e))} _selectedItem={{
                    bg: "cyan.600",
                        endIcon: <CheckIcon size={4} />
                    }} accessibilityLabel="Select genre">
                    <Select.Item label="Drama" value="Drama" />
                    <Select.Item label="Documentary" value="Documentary" />
                    <Select.Item label="Sports" value="Sports" />
                    <Select.Item label="Silent" value="Silent" />
                    <Select.Item label="Adventure" value="Adventure" />
                    <Select.Item label="Western" value="Western" />
                    <Select.Item label="Romance" value="Romance" />
                    <Select.Item label="War" value="War" />
                    <Select.Item label="Comedy" value="Comedy" />
                    <Select.Item label="Horror" value="Horror" />
                    <Select.Item label="Historical" value="Historical" />
                    <Select.Item label="Animated" value="Animated" />
                    </Select>
                    </Box>
                    <Box>
                        <Button
                            onPress={() => {
                                setFilterYear(true);
                            }}
                        >
                            <Text>Year</Text>
                        </Button>
                    </Box>
                    <YearPicker
                            open={filterYear}
                            onClose={() => setFilterYear(false)}
                    />
                    <Box>
                    <Select selectedValue={sorting} mx={{base: 0, md: "Sort"
                        }} onValueChange={e => dispatch(setSorting(e))} _selectedItem={{
                    bg: "cyan.600",
                        endIcon: <CheckIcon size={4} />
                        }} accessibilityLabel="Sort">
                        <Select.Item label="Ascending" value="1" />
                        <Select.Item label="Descending" value="-1" />
                    </Select>
                    </Box>
                    <Box>
                        <Button 
                            onPress={useReset}
                        >
                           <Text>Reset Filters</Text> 
                        </Button>
                    </Box>
                    <Box>
                        <Button
                            onPress={() => {
                                setOpenCreate(true);
                            }}
                        >
                            <Text>Add New Film</Text>
                        </Button>
                        <CreateForm
                            open={openCreate}
                            onCreate={onCreate}
                            onCancel={() => {
                                setOpenCreate(false);
                            }}
                        /> 
                    </Box>
                </Box>

                <Row justifyContent="center" alignItems = 'center'>
                    {body}
                </Row>

                <ShowFilmItem 
                    film={currentPost} 
                    open={showFilm} 
                    onCancel={hideFilm} 
                />

                <Button
                    disabled={loading}
                    onPress={() => (setPage(prev => prev-1))}
                >
                    <Text>Previous</Text>
                </Button>

                <Button
                    disabled={loading}
                    onPress={() => (setPage(prev => prev+1))}
                >
                    <Text>Next</Text>
                </Button>
            </Box>
        }
        </>
    )
};
