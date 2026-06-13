export type ItemType = "lesson" | "exercise";

export interface BaseItem {
    id: string;
    type: ItemType;
    title: string;
}

export interface Test {
    input: string;
    expected: string;
}

// Paths are relative to /root/www/data

export interface LessonItem extends BaseItem {
    type: "lesson";
    contentFile: string;
}

export interface ExerciseItem extends BaseItem {
    type: "exercise";
    contentFile: string;
    tests: Test[];
}


export type TopicItem = LessonItem | ExerciseItem;


export interface Topic {
    id: string;
    title: string;
    items: TopicItem[];
}


export interface ActiveItem {
    topicId: string;
    itemId: string;
}