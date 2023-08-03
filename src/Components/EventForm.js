import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import Profile from "./Profile";

export default function EventForm() {
    const navigate = useNavigate();
    const params = useParams();
    const [product, setEvent] = useState({});
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (params.id) {
            const products = JSON.parse(localStorage.getItem("products"));
            if (products && products.length) {
                const ev = products.find(e => e.id === Number(params.id));
                if (ev) {
                    setEvent(ev);
                } else {
                    navigate("/events");
                }
            }
        }
    }, []);

    const handleChange = (e) => {
        let {name: brand, value} = e.target;
        if (brand === "price") {
            value = value.replace(/\D/g, "");
        }
        setEvent(prev => {
            return {
                ...prev,
                [brand]: value
            }
        });

        setError(brand, "");
    }

    const setError = (name, value) => {
        setErrors(prev => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const cancel = () => {
        setEvent({});
        setErrors({});
        navigate("/events");
    }

    const create = () => {

        const validate = ["brand", "name", "price", "date", "type"];
        let errs = {};
        for (let i = 0; i < validate.length; i++) {
            if (!product[validate[i]]) {
                errs = {...errs, [validate[i]]: `${validate[i]} is required`};
            }
        }

        setErrors(prev => {
            return {
                ...prev,
                ...errs
            }
        });

        if (!Object.keys(errs).length) {
            save();
        }
    }

    const save = () => {
        const data = [];
        const user = {id: 1};
        const old = JSON.parse(localStorage.getItem("events"));
        let id = 1;
        if (old) {
            data.push(...old);
            id = old.length ? old[old.length - 1].id + 1 : 1;
        }

        if (product?.id) {
            const oldEvent = data.find(o => o.id === product.id);
            for (const a in oldEvent) {
                oldEvent[a] = product[a];
            }
        } else {
            data.push({id, userId: user.id, ...product});
        }

        localStorage.setItem("events", JSON.stringify(data));
        cancel();
    }

    return (
        <div>
            <Profile children={
                <button style={{width: "80px"}} onClick={() => navigate("/events")}>Events</button>
            }/>
            <div className="card">
                <div className="form">
                    <div className="title">
                        <p>{product.id ? "Update" : "Create"} Event</p>
                    </div>
                    <div className="space"></div>
                    <div>
                        <label> Brand-Name<span className="mandatory">*</span></label>
                        <div className="radio" style={{display: "flex"}}>
                            <div>
                                <label>
                                    <input type="radio" name="brand" value="Apple" checked={product.brand === "Apple"}
                                           onChange={handleChange}/>
                                    &nbsp;Apple</label>
                            </div>

                            <div style={{marginLeft: "10px"}}>
                                <label>
                                    <input type="radio" name="brand" value="Samsung" checked={product.brand === "Samsung"}
                                           onChange={handleChange}/>
                                    &nbsp;Samsung</label>
                            </div>

                            <div style={{marginLeft: "10px"}}>
                                <label>
                                    <input type="radio" name="brand" value="MI" checked={product.brand === "MI"}
                                           onChange={handleChange}/>
                                    &nbsp;MI</label>
                            </div> 

                            
                        </div>
                                                 
                        {
                            !!errors.brand
                             && <span className="mandatory">{errors.brand}</span>
                        }
                    </div>
                    <div className="space"></div>
                    <div>
                        <label>Product name<span className="mandatory">*</span></label>
                        <textarea style={{width: "100%"}} rows="4" name="name" value={product.name || ""}
                                  onChange={handleChange}></textarea>
                        {
                            !!errors.name && <span className="mandatory">{errors.name}</span>
                        }
                    </div>
                    <div className="space"></div>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <div style={{width: "45%"}}>
                            <label>Price<span className="mandatory">*</span></label>
                            <input type="text" name="price" value={product.price || ""} onChange={handleChange}/>
                            {
                                !!errors.price && <span className="mandatory">{errors.price}</span>
                            }
                        </div>
                        <div style={{width: "45%"}}>
                            <label>Date<span className="mandatory">*</span></label>
                            <input type="date" name="date" value={product.date || ""} onChange={handleChange}/>
                            {
                                !!errors.date && <span className="mandatory">{errors.date}</span>
                            }
                        </div>
                    </div>
                    <div className="space"></div>
                    <div>
                        <label>Type<span className="mandatory">*</span></label>
                        <div className="space"></div>
                        <div className="radio" style={{display: "flex"}}>
                            <div>
                                <label>
                                    <input type="radio" name="type" value="Laptop" checked={product.type === "Laptop"}
                                           onChange={handleChange}/>
                                    &nbsp;Laptop</label>
                            </div>
                            <div style={{marginLeft: "10px"}}>
                                <label>
                                    <input type="radio" name="type" value="Mobile" checked={product.type === "Mobile"}
                                           onChange={handleChange}/>
                                    &nbsp;Mobile</label>
                            </div>
                        </div>
                        {
                            !!errors.type && <span className="mandatory">{errors.type}</span>
                        }
                    </div>
                    <div className="space"></div>
                    <div>
                        <button onClick={() => cancel()}>Cancel</button>
                        <button style={{marginLeft: "5px"}}
                                onClick={() => create()}>{product.id ? "Update" : "Create"}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}