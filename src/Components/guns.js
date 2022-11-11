import React from 'react';
class guns extends React.Component {

    render() {
        return (
            <div className='gunsection'>
                <img src='data:image/jpeg;base64,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'></img>
                <div>Typhongl5</div>
            </div>
        );

    }
}
export default guns
