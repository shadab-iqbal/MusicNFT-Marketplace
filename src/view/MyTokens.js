import { useState, useEffect, useRef } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card, Button, InputGroup, Form } from 'react-bootstrap'
import {LoadTokens, ResellItem} from '../controller/MyTokensControl.js';

function MyTokens({ contract }) {
  const audioRefs = useRef([]);
  const [isPlaying, setIsPlaying] = useState(null);
  const [loading, setLoading] = useState(true);
  const [myTokens, setMyTokens] = useState(null);
  const [selected, setSelected] = useState(0);
  const [previous, setPrevious] = useState(null);
  const [resellId, setResellId] = useState(null);
  const [resellPrice, setResellPrice] = useState(null);

  const stateMethods = [contract, audioRefs, isPlaying, setIsPlaying, loading, setLoading, myTokens, setMyTokens, selected, setSelected, 
  previous, setPrevious, resellId, setResellId, resellPrice, setResellPrice];

  useEffect(() => {
    if (isPlaying) {
      audioRefs.current[selected].play()
      if (selected !== previous) audioRefs.current[previous].pause()
    } else if (isPlaying !== null) {
      audioRefs.current[selected].pause()
    }

  })

  useEffect(() => !myTokens && LoadTokens(stateMethods))

  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )


  return (
    <div className="flex justify-center">
      {myTokens.length > 0 ?
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {myTokens.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <audio src={item.audio} key={idx} ref={el => audioRefs.current[idx] = el}></audio>
                <Card>
                  <Card.Img variant="top" src={item.identicon} />
                  <Card.Body color="secondary">
                    <Card.Title>{item.name}</Card.Title>
                    <div className="d-grid px-4">
                      <Button variant="secondary" onClick={() => {
                        setPrevious(selected)
                        setSelected(idx)
                        if (!isPlaying || idx === selected) setIsPlaying(!isPlaying)
                      }}>
                        {isPlaying && selected === idx ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" className="bi bi-pause" viewBox="0 0 16 16">
                            <path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" className="bi bi-play" viewBox="0 0 16 16">
                            <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z" />
                          </svg>
                        )}
                      </Button>
                    </div>
                    <Card.Text className="mt-1">
                      {ethers.utils.formatEther(item.price)} ETH
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <InputGroup className="my-1">
                      <Button onClick={() => ResellItem(stateMethods, item)} variant="outline-primary" id="button-addon1">
                        Resell
                      </Button>
                      <Form.Control
                        onChange={(e) => {
                          setResellId(item.itemId)
                          setResellPrice(e.target.value)
                        }}
                        size="md"
                        value={resellId === item.itemId ? resellPrice : ''}
                        required type="number"
                        placeholder="Price in ETH"
                      />
                    </InputGroup>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No owned tokens</h2>
          </main>
        )}
    </div>
  );
}

export default MyTokens;