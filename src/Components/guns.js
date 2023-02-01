import React from 'react';
class guns extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {},
            loaded: false,
            keys: [],
            styles: {},
            perkClasses: {}
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
                await this.setState({ data: fetchedJson, keys: keys, })

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
                const perkClasses = this.state.perkClasses
                const style = {}
                for (let i = 0; i < keys.length; i++) {
                    const gunKey = keys[i]
                    const perkLength = fetchedJson['Guns'][gunKey]['gunStats']['perks'].length

                    /*   console.log(style) */
                    Object.defineProperty(style, gunKey, {
                        value: {},
                        writable: true,
                    })
                    Object.defineProperty(perkClasses, gunKey, {
                        value: {},
                        writable: true,
                    })
                    for (let i2 = 0; i2 < perkLength; i2++) {
                        Object.assign(style[gunKey], { [i2]: { className: 'hiddenName' } })
                        Object.assign(perkClasses[gunKey], { [i2]: { className: 'perk' } })
                    }
                }
                await this.setState({ styles: style, loaded: true, perkClasses: perkClasses })
                /*   console.log(style)
                  console.log(perkClasses) */
                /*                 console.log(this.state.data) */

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
            /*   console.log(this.state.data) */

            const gunStyle = {
                display: 'flex',

            }
            const gundata = this.state.data;
            const gunKeys = this.state.keys;
            const gunInfo = gunKeys.map(i => {
                const icons = gundata.Guns[i].gunStats.icon
                const flavorText = gundata.Guns[i].gunStats.flavorText
                const gunPerks = gundata.Guns[i].gunStats.perks.map((i2, index) => {
                    return (

                        < div className={this.state.perkClasses[i][index]['className']} >
                            < img className='perkIcon' key={`${i}-${i2.icon}`} src={`http://www.bungie.net${i2.icon}`}
                                onMouseOver={() => {
                                    console.log()
                                    const className = this.state.styles
                                    let perkClassName = this.state.perkClasses
                                    /*   if (className[i][index]['className'] == 'visibleName' && perkClassName[i][index]['className'] == 'perk-coverPerks') {
                                          className[i][index] = { className: 'hiddenName' }
                                          perkClassName[i][index] = { className: 'perk' }
                                          this.setState({ styles: className, perkClasses: perkClassName })

                                          console.log(this.state.perkClasses)

                                          return
                                      } */
                                    perkClassName[i][index] = { className: 'perk-coverPerks' }
                                    className[i][index] = { className: 'visibleName' }
                                    this.setState({ styles: className, perkClasses: perkClassName })
                                    /* styles[i] = {display: 'flex' } */

                                    console.log(this.state.perkClasses)
                                }}
                                onMouseLeave={() => {
                                    console.log(index)
                                    const className = this.state.styles
                                    let perkClassName = this.state.perkClasses
                                    if (className[i][index]['className'] == 'visibleName' && perkClassName[i][index]['className'] == 'perk-coverPerks') {
                                        className[i][index] = { className: 'hiddenName' }
                                        perkClassName[i][index] = { className: 'perk' }
                                        this.setState({ styles: className, perkClasses: perkClassName })

                                        console.log(this.state.perkClasses)

                                        return
                                    }

                                }}
                            >
                            </img >
                            <div className={this.state.styles[i][index]['className']} >
                                <p>{i2.name}</p>
                                <p>{i2.description}</p>
                            </div>
                        </div >




                        /*  <div className='perkNameContainer'>
                             <div className={this.state.styles[i][index]['className']} >
                                 <p>{i2.name}</p>
                                 <p>{i2.description}</p>
                             </div>
                         </div> */
                    )
                })
                /* const gunPerkNames = gundata.Guns[i].gunStats.perks.map((i2, index) => {
                    return (
                        <div className={this.state.styles[i][index]['className']} >
                            <p>{i2.name}</p>
                            <p>{i2.description}</p>
                        </div>
                    )
                }) */

                /* console.log(gunPerks[0]) */
                const element = <div key={i} style={gunStyle} >
                    <img key={`${i}${icons}`} src={`http://www.bungie.net${icons}`}></img>
                    <div >
                        <p key={`${i}-${gundata.Guns[i].gunStats.name}`} >{gundata.Guns[i].gunStats.name}</p>
                        <p>{flavorText}</p>
                    </div>
                </div >;

                return (
                    <div className='gunContainer' >
                        {element}
                        <div className='perkContainer'>{gunPerks}</div>
                        {/*    {<div className='perkNames'>{gunPerkNames}</div>} */}
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
