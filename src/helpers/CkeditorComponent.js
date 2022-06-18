import {CKEditor} from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {Container} from "@material-ui/core";
import Delayed from "./Delayed";

export function CkeditorComponent({name, content}) {
    return (
        <Delayed>
            <Container className={'ckeditorEditorContainer'}>
                <CKEditor
                    name={name}
                    editor={ClassicEditor}
                    data={content}
                    config={{
                        toolbar: ['heading', '|', 'bold', 'italic', 'blockQuote', 'link', 'numberedList', 'bulletedList', 'insertTable',
                            'tableColumn', 'tableRow', 'mergeTableCells', 'mediaEmbed', '|', 'undo', 'redo']
                    }}
                    onReady={
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
        </Delayed>


    )
}

export default CkeditorComponent;
