import {DeclarationReflection, Renderer} from 'typedoc';

export function load(app) {
    app.renderer.on(Renderer.EVENT_END_PAGE, (page) => {
        if (page.contents && page.model instanceof DeclarationReflection) {
            page.contents = page.contents.replace(
                /#{4,5}\s+(Returns|Call Signature|Parameters)/gi,
                '$1',
            );
        }
    });
}
