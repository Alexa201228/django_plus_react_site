import {CKEditor} from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {Container} from "@material-ui/core";


const CkeditorComponent = ({name, content}) => {
    return (
        <Container className={'ckeditorEditorContainer'}>
            <CKEditor
                name={name}
                editor={ClassicEditor}
                data={content}
                onReady = {
                    editor => {
                        localStorage.setItem(name, content)
                    }
                }
                onChange={(event, editor) => {
                    const data = editor.getData();
                    localStorage.setItem(name, data)
                }}
            />
        </Container>

    )
};

export default CkeditorComponent;
