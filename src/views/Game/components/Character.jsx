import React, { useState } from "react";
import { CLASS_LIST, SKILL_LIST } from "../../../consts"

function Character(props) {
    const { character, updateCharacter, checkCharacterSkill } = props;
    const [attributes, setAttributes] = useState(character.attributes);
    const [skills, setSkills] = useState(character.skills);
    const [totalPoint, setTotalPoint] = useState(character.totalPoint);
    const [DC, setDC] = useState(20);
    const [checkSkill, setCheckSkill] = useState("Acrobatics");

    const handleUpdateCharacter = () => {
        setTimeout(
            updateCharacter({
                ...character,
                attributes: attributes,
                skills: skills,
                totalPoint: totalPoint
            }), 100)
    }
    const handleSetAttribute = (attName, { value, modifier }) => {
        // check maximum limitation
        let totalAttribute = value;
        Object.keys(attributes).forEach(att => { if (att !== attName) { totalAttribute += attributes[att]['value'] } });
        if (totalAttribute > 70) {
            alert('A Character can have up to 70 Delegated Attribute Points');
            return;
        }
        // set state
        const newState = {
            ...attributes
        };
        newState[attName]["value"] = value;
        newState[attName]["modifier"] = modifier;
        setAttributes(newState);
        const calcNewTotalPoint = 10 + (4 * newState["Intelligence"]["modifier"]);
        setTotalPoint(calcNewTotalPoint > 0 ? calcNewTotalPoint : 0);
        handleUpdateCharacter()
    }
    const handleSetSkill = (skillName, value) => {
        // check value
        if (value < 0) {
            alert('The minimum value of a skill is 0');
        }
        let totalSkillPoints = value;
        Object.keys(skills).forEach(skill => { if (skill !== skillName) { totalSkillPoints += skills[skill] } });
        if (totalSkillPoints > totalPoint) {
            alert('All skill points have been spent');
            return;
        }

        // set state
        const newState = {
            ...skills
        };
        newState[skillName] = value;
        setSkills(newState);
        handleUpdateCharacter()
    }
    const handleRoll = () => {
        const randNumber = Math.ceil(20 * Math.random(1));
        checkCharacterSkill({
            name: character.name,
            checkSkill: checkSkill,
            totalPoint: skills[checkSkill] + attributes[SKILL_LIST.find(e => e.name === checkSkill).attributeModifier]['modifier'],
            randNumber: randNumber,
            DC: DC
        });
    }
    return (
        <div style={{ width: '100%', border: "1px solid white" }}>
            <div style={{ fontSize: "36px", margin: "15px" }}>{character.name}</div>
            <CheckSkillBoard />
            <div style={{ display: "flex", justifyContent: "space-around" }}>
                <AttributeBoard attList={attributes} />
                <ClassBoard />
                <SkillBoard />
            </div>
        </div>
    )

    function AttributeBoard(ABProps) {
        const { attList } = ABProps;
        return (
            <div style={{ width: "25%", border: "1px solid white" }}>
                <div style={{ fontSize: "24px", margin: "10px 15px" }}>Attributes</div>
                {Object.keys(attList).map(att => {
                    return (
                        <div key={`${character.name}-${att}`}>
                            <span>{att}: {attList[att]['value']} (Modifier: {attList[att]['modifier']})</span>
                            <button onClick={() => {
                                handleSetAttribute(att, { value: attList[att]['value'] + 1, modifier: Math.floor(((attList[att]['value'] + 1) - 10) / 2) })
                            }}>+</button>
                            <button onClick={() => {
                                handleSetAttribute(att, { value: attList[att]['value'] - 1, modifier: Math.floor(((attList[att]['value'] - 1) - 10) / 2) })
                            }}>-</button>
                        </div>
                    )
                })}
            </div>
        )
    }

    function ClassBoard() {
        const [displayRequirement, setDisplayRequirement] = useState(false);
        const [displayClass, setDisplayClass] = useState('');
        return (
            <div style={{ width: "20%", border: "1px solid white" }}>
                <div style={{ fontSize: "24px", margin: "10px 15px" }}>Classes</div>
                {Object.keys(CLASS_LIST).map(element => {
                    return (
                        <div key={`${character.name}-${element}`}>
                            <div style={{
                                color: (
                                    Object.keys(attributes).map(att => attributes[att]['value'] >= CLASS_LIST[element][att]).filter(e => !e).length === 0
                                ) ? "red" : "white"
                            }}
                                onClick={() => {
                                    setDisplayRequirement(true);
                                    setDisplayClass(element);
                                }}>{element}</div>
                        </div>
                    )
                })}
                {displayRequirement &&
                    <div style={{ border: "1px solid white", marginTop: "20px" }}>
                        <div style={{ fontSize: "24px" }}>{displayClass} Minimum Requirements</div>
                        {Object.keys(CLASS_LIST[displayClass]).map(att => {
                            return (
                                <div key={`${character.name}-minimumReq-${att}`}>
                                    {att}: {CLASS_LIST[displayClass][att]}
                                </div>
                            )
                        })}
                        <button onClick={() => { setDisplayRequirement(false) }}>Close</button>
                    </div>
                }
            </div>
        )
    }

    function SkillBoard() {
        return (
            <div style={{ width: "40%", border: "1px solid white" }}>
                <div style={{ fontSize: "24px", margin: "10px 15px" }}>Skills</div>
                <div style={{ margin: "10px 15px" }}>Total skill points available: {totalPoint}</div>
                {SKILL_LIST.map(skillDef => {
                    return (
                        <div key={`${character.name}-${skillDef.name}`}>
                            <span>{skillDef.name} - Points: {skills[skillDef.name]} </span>
                            <button onClick={() => {
                                handleSetSkill(skillDef.name, skills[skillDef.name] + 1)
                            }}>+</button>
                            <button onClick={() => {
                                handleSetSkill(skillDef.name, skills[skillDef.name] - 1)
                            }}>-</button>
                            <span> Modifier ({skillDef.attributeModifier}): {attributes[skillDef.attributeModifier]['modifier']}</span>
                            <span> Total: {skills[skillDef.name] + attributes[skillDef.attributeModifier]['modifier']}</span>
                        </div>
                    )
                })}
            </div>
        )
    }

    function CheckSkillBoard() {
        return (
            <div style={{ border: "1px solid white" }}>
                <div style={{ fontSize: "24px", margin: "10px 15px" }}>Skill Check</div>
                <div>
                    <label>Skill </label>
                    <select name={`${character.name.replace(/\s/g, '')}-checkSkill`} value={checkSkill} onChange={(e) => { setCheckSkill(e.target.value); }}>
                        {SKILL_LIST.map(skill => {
                            return (
                                <option key={`${character.name.replace(/\s/g, '')}-skillOption-${skill.name}`}
                                    value={skill.name}
                                >{skill.name}</option>
                            )
                        })}
                    </select>
                    <label> DC: </label>
                    <input value={DC} onChange={(e) => { setDC(e.target.value) }} />
                    <button onClick={() => { handleRoll(); }}>Roll</button>
                </div>
            </div >
        )
    }
}

export default Character;