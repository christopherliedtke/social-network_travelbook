import React from "react";
import Bio from "../Bio";
import { render, fireEvent, waitForElement } from "@testing-library/react";

import axios from "../axios";

jest.mock("../axios.js");

test("Add button is rendered in <Bio /> if no bio is passed to it", () => {
    const { container } = render(<Bio first="Chris" last="Liedtke" />);
    expect(container.querySelector("button").innerHTML).toBe("Add bio");
});

test("Edit button is rendered in <Bio /> if bio is passed to it", () => {
    const { container } = render(
        <Bio first="Chris" last="Liedtke" bio="My bio" />
    );
    expect(container.querySelector("button").innerHTML).toBe("Edit bio");
});

test("Clicking either the 'Add' or 'Edit' button causes a textarea and a 'Save' button to be rendered.", () => {
    const { container } = render(
        <Bio first="Chris" last="Liedtke" bio="My bio " />
    );
    fireEvent.click(container.querySelector("button"));
    expect(container.querySelector("div").innerHTML).toContain("textarea");
    expect(container.querySelector("button").innerHTML).toBe("Update");
});

test("Clicking the 'Save' button causes an ajax request", async () => {
    axios.post.mockResolvedValue({
        data: { success: true },
    });

    const { container } = render(
        <Bio first="Chris" last="Liedtke" bio="My bio" />
    );

    fireEvent.click(container.querySelector("button"));

    fireEvent.click(container.querySelector("button"));

    return axios.post().then((response) => {
        expect(response.data.success).toBe(true);
    });
});

test("When the mock request is successful, the function that was passed as a prop to the component gets called.", async () => {
    const myMockOnClick = jest.fn();

    axios.post.mockResolvedValue({
        data: { success: true },
    });

    const { container } = render(
        <Bio
            first="Chris"
            last="Liedtke"
            bio="My bio"
            updateBio={myMockOnClick}
        />
    );

    fireEvent.click(container.querySelector("button"));

    fireEvent.click(container.querySelector("button"));

    await waitForElement(() => container.querySelector("div"));

    expect(myMockOnClick.mock.calls.length).toBe(1);
});
