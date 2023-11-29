export const makeResponsive = (renderer, camera) => {
    const { domElement } = renderer;
    const { clientWidth, width, clientHeight, height } = domElement;

    const resize = clientWidth != width || clientHeight != height;

    if (resize) {
        renderer.setSize(clientWidth, clientHeight, false);
        renderer.setPixelRatio(window.devicePixelRatio);
        camera.aspect = clientWidth / clientHeight;
        camera.updateProjectionMatrix();
    }
};
