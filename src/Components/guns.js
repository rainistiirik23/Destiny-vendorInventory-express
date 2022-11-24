import React from 'react';
import image from '/example.png';
class guns extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {},
            loaded: false,
            keys: [],
            styles: {}
        }
    }
    bansheeRequest() {
        const jsonify = res => {
            return (
                new Promise((resolve, reject) => {
                    if (res) {
                        resolve(res.json())
                    }
                    else {
                        reject(console.warn('Soemthing went wrong at jsonify'))
                    }
                })
            )
        };
        const fetchRequest = async () => {
            try {
                const fetched = await fetch('banshee', { method: 'GET' });
                const fetchedJson = await jsonify(fetched)
                const keys = Object.keys(fetchedJson['Guns'])
                await this.setState({ data: fetchedJson, /* loaded: true, */ keys: keys, })

            }
            catch (err) {
                console.log(err)
            }
        };
        fetchRequest();
    };
    makeStylestate() {
        const jsonify = res => {
            return (
                new Promise((resolve, reject) => {
                    if (res) {
                        resolve(res.json())
                    }
                    else {
                        reject(console.warn('Soemthing went wrong at jsonify'))
                    }
                })
            )
        };
        const makeStyleState = async () => {
            try {
                const fetched = await fetch('banshee', { method: 'GET' });
                const fetchedJson = await jsonify(fetched);
                const keys = Object.keys(fetchedJson['Guns']);

                const style = {}
                for (let i = 0; i < keys.length; i++) {
                    const gunKey = keys[i]
                    const perkLength = fetchedJson['Guns'][gunKey]['gunStats']['perks'].length

                    /*   console.log(style) */
                    Object.defineProperty(style, gunKey, {
                        value: {},
                        writable: true,
                    })
                    for (let i2 = 0; i2 < perkLength; i2++) {
                        Object.assign(style[gunKey], { [i2]: { className: 'hiddenName' } })
                    }
                }
                await this.setState({ styles: style, loaded: true })
                console.log(style)
            }
            catch (err) {
                console.log(err)
            }
        };
        makeStyleState();
    }

    componentDidMount() {
        this.bansheeRequest();
        this.makeStylestate();
        /* this.loopExample(); */
    }
    componentDidUpdate() {
        /*   this.showAPerkName() */
    }

    render() {

        if (!this.state.loaded) {
            return <h1>Loading</h1>
        }
        if (this.state.loaded) {

            const gunStyle = {
                display: 'flex'
            }
            const gundata = this.state.data;
            const gunKeys = this.state.keys;
            const gunInfo = gunKeys.map(i => {
                const icons = gundata.Guns[i].gunStats.icon
                const gunPerks = gundata.Guns[i].gunStats.perks.map((i2, index) => {
                    return (
                        < div >


                            <div className={this.state.styles[i][index]['className']} >{i2.name}</div>

                            < img key={`${i}-${i2.icon}`} src={`http://www.bungie.net${i2.icon}`}
                                onClick={() => {
                                    console.log(index)
                                    const className = this.state.styles
                                    if (className[i][index]['className'] == 'visibleName') {
                                        className[i][index] = { className: 'hiddenName' }
                                        this.setState(className)
                                        console.log(className[i][index])
                                        return
                                    }
                                    className[i][index] = { className: 'visibleName' }
                                    this.setState(className)
                                    /* styles[i] = {display: 'flex' } */
                                    console.log(className[i][index]);
                                }}
                            >
                            </img >
                        </div >
                    )
                })
                /* console.log(gunPerks[0]) */
                const element = <div key={i} style={gunStyle} >
                    <img key={`${i}${icons}`} src={`http://www.bungie.net${icons}`}></img>
                    <p key={`${i}-${gundata.Guns[i].gunStats.name}`} >{gundata.Guns[i].gunStats.name}</p>
                </div >;

                return (
                    <div >
                        {element}
                        <div style={gunStyle}>{gunPerks}</div>
                    </div>

                );
            });
            /*   console.log(gunInfo) */
            return (
                gunInfo

            );

        }
    }
}
export default guns
