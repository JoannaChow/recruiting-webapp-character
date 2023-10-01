import React, { useEffect, useState } from "react";
import Character from "./components/Character";
import { GIT_USERNAME, ATTRIBUTE_LIST, SKILL_LIST } from "../../consts";

function Game() {
    const [CharacterList, setCharacterList] = useState([]);
    const [characterSkill, setCharacterSkill] = useState({ name: "", checkSkill: "", totalPoint: 0, randNumber: 0, DC: 0 });
    useEffect(() => {
        GetAllCharacters();
    }, [])
    const GetAllCharacters = () => {
        fetch(`https://recruiting.verylongdomaintotestwith.ca/api/{${GIT_USERNAME}}/character`)
            .then(response => response.json())
            .then(result => {
                if (result.statusCode === 200 && result.body?.characters) {
                    setCharacterList(result.body?.characters)
                }
            })
    }
    const SaveAllCharacters = () => {
        const postHeaders = new Headers();
        postHeaders.append("Content-Type", "application/json");
        fetch(`https://recruiting.verylongdomaintotestwith.ca/api/{${GIT_USERNAME}}/character`,
            {
                method: "POST",
                headers: postHeaders,
                body: JSON.stringify({ "characters": CharacterList })
            }
        ).then(response => response.json())
            .then(result => {
                console.log(result)
            })
    }
    const handleUpdateCharacterList = (character) => {
        const index = CharacterList.findIndex(cha => cha.name === character.name);
        let newState;
        if (index === 0) {
            // the first character
            const restCharacters = CharacterList.slice(1);
            newState = [character, ...restCharacters];
        } else if (index === CharacterList.length - 1) {
            // the last character
            const restCharacters = CharacterList.slice(0, index);
            newState = [...restCharacters, character];
        } else {
            const firstHalf = CharacterList(0, index);
            const secondHalf = CharacterList(index + 1);
            newState = [...firstHalf, character, ...secondHalf];
        }
        setCharacterList(newState);
    }
    const AddCharacter = () => {
        const newCharacter = {
            name: `Character ${CharacterList.length + 1}`,
            totalPoint: 10,
            attributes: {},
            skills: {}
        }
        ATTRIBUTE_LIST.forEach(att => {
            newCharacter.attributes[att] = {};
            newCharacter.attributes[att]['value'] = 10;
            newCharacter.attributes[att]['modifier'] = 0;
        })
        SKILL_LIST.forEach(skill => {
            newCharacter.skills[skill.name] = 0;
        })
        const newState = [...CharacterList, newCharacter];
        setCharacterList(newState);
    }
    return (
        <>
            <button onClick={() => { AddCharacter() }}>Add New Character</button>
            <button onClick={() => { SaveAllCharacters() }}>Save All Character</button>
            {characterSkill.name > "" &&
                <SkillCheck />
            }
            {CharacterList.map(character => {
                return (
                    <Character key={`character-${character.name}`}
                        character={character}
                        updateCharacter={handleUpdateCharacterList}
                        checkCharacterSkill={setCharacterSkill}
                    />
                )
            })}
        </>
    )

    function SkillCheck() {
        return (
            <div style={{ border: "1px solid white" }}>
                <div style={{ fontSize: "24px", margin: "10px 15px" }}>Skill Check</div>
                <div style={{ fontSize: "24px", margin: "10px 15px" }}>{characterSkill.name}</div>
                <div>
                    <div>Skill: {characterSkill.checkSkill}: {characterSkill.totalPoint}</div>
                    <div>You Rolled: {characterSkill.randNumber}</div>
                    <div>The DC was: {characterSkill.DC}</div>
                    <div>Skill Check Result: {(characterSkill.totalPoint + characterSkill.randNumber) >= characterSkill.DC ? 'Successful' : 'Failure'}</div>
                </div>
            </div >
        )
    }
}

export default Game;